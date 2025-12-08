"use server";

import { getUser } from "@/auth/server";
import { prisma } from "@/db/prisma";
import { handleError } from "@/lib/utils";
import { geminiModel } from "@/lib/gemini"; 

export const createNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to create a note");

    await prisma.note.create({
      data: {
        id: noteId,
        authorId: user.id,
        text: "",
      },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const updateNoteAction = async (noteId: string, text: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to update a note");

    await prisma.note.update({
      where: { id: noteId },
      data: { text },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const deleteNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error("You must be logged in to delete a note");

    await prisma.note.delete({
      where: { id: noteId, authorId: user.id },
    });

    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const askAIAboutNotesAction = async (
  newQuestions: string[],
  responses: string[],
) => {
  const user = await getUser();
  if (!user) throw new Error("You must be logged in to ask AI questions");

  const notes = await prisma.note.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: "desc" },
    select: { text: true, createdAt: true, updatedAt: true },
  });

  if (notes.length === 0) {
    return "You don't have any notes yet.";
  }

  const formattedNotes = notes
    .map((note) =>
      `
      Text: ${note.text}
      Created at: ${note.createdAt}
      Last updated: ${note.updatedAt}
      `.trim(),
    )
    .join("\n");

  // Build a single prompt string for Gemini instead of OpenAI messages[]
  let prompt = `
You are a helpful assistant that answers questions about a user's notes.
Assume all questions are related to the user's notes.

Requirements:
- Keep answers concise, not too verbose.
- Output MUST be clean, valid HTML.
- Use tags like <p>, <strong>, <em>, <ul>, <ol>, <li>, <h1>-<h6>, <br> when appropriate.
- Do NOT use inline styles, JavaScript, or custom attributes.
- Do NOT wrap the entire response in a single <p> if there are multiple paragraphs.

The JSX will render like this:
<p dangerouslySetInnerHTML={{ __html: YOUR_RESPONSE }} />

Here are the user's notes:
${formattedNotes}

Conversation so far:
`;

  for (let i = 0; i < newQuestions.length; i++) {
    prompt += `\nUser: ${newQuestions[i]}\n`;
    if (responses.length > i) {
      prompt += `Assistant: ${responses[i]}\n`;
    }
  }

  try {
    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text();

    return text || "A problem has occurred";
  } catch (error) {
    console.error("Gemini error in askAIAboutNotesAction:", error);
    return "A problem has occurred while generating AI response.";
  }
};

