"use client";

import React, { useState, useActionState } from "react";
import { Input } from "@/components/ui/input"; // Simplified import paths for better project structure.
import { Textarea } from "@/components/ui/textarea"; // Ensures uniformity in UI components.
import MDEditor from "@uiw/react-md-editor"; // Reusable Markdown editor for the "Pitch" section.
import { Button } from "@/components/ui/button"; // Uses Button component from the project library.
import { Send } from "lucide-react"; // Added icon library to enhance the UI.
import { formSchema } from "@/lib/validation"; // Centralized validation logic.
import { z } from "zod"; // Retained Zod for schema validation.
import { useToast } from "@/hooks/use-toast"; // Uses custom toast hooks for user notifications.
import { useRouter } from "next/navigation"; // Replaced `next/router` with `next/navigation` for consistency with Next.js 13+.
import { createPitch } from "@/lib/actions"; // Reused logic for server interaction.

const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState(""); // Maintains the pitch text state.
  const { toast } = useToast();
  const router = useRouter();

  const handleFormSubmit = async (
    prevState: { error: string; status: string },
    formData: FormData
  ) => {
    try {
      const formValues = {
        title: formData.get("title") as string, // Retrieves title input.
        description: formData.get("description") as string, // Retrieves description input.
        category: formData.get("category") as string, // Retrieves category input.
        link: formData.get("link") as string, // Retrieves link input.
        pitch, // Retains the pitch from the state.
      };

      await formSchema.parseAsync(formValues); // Validates form inputs with Zod.

      const result = await createPitch(prevState, formData, pitch); // Sends data to the server.

      if (result.status == "SUCCESS") {
        // Improved toast message.
        toast({
          title: "Success",
          description: "Your startup pitch has been created successfully",
        });

        router.push(`/startup/${result._id}`); // Uses `result._id` directly for navigation.
      }

      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors; // Improved variable naming for clarity.

        setErrors(fieldErrors as unknown as Record<string, string>); // Updates error state.

        toast({
          title: "Error",
          description: "Please check your inputs and try again",
          variant: "destructive", // Added "destructive" for better UX.
        });

        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }

      toast({
        title: "Error",
        description: "An unexpected error has occurred",
        variant: "destructive",
      });

      return {
        ...prevState,
        error: "An unexpected error has occurred",
        status: "ERROR",
      };
    }
  };

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL", // Corrected spelling of the initial state.
  });

  return (
    <form action={formAction} className="startup-form">
      <div>
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          className="startup-form_input"
          required
          placeholder="Startup Title"
        />

        {errors.title && <p className="startup-form_error">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="startup-form_label">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          className="startup-form_textarea"
          required
          placeholder="Startup Description"
        />

        {errors.description && (
          <p className="startup-form_error">{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="startup-form_label">
          Category
        </label>
        <Input
          id="category"
          name="category"
          className="startup-form_input"
          required
          placeholder="Startup Category (Tech, Health, Education...)"
        />

        {errors.category && (
          <p className="startup-form_error">{errors.category}</p>
        )}
      </div>

      <div>
        <label htmlFor="link" className="startup-form_label">
          Image URL
        </label>
        <Input
          id="link"
          name="link"
          className="startup-form_input"
          required
          placeholder="Startup Image URL"
        />

        {errors.link && <p className="startup-form_error">{errors.link}</p>}
      </div>

      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label">
          Pitch
        </label>

        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder:
              "Briefly describe your idea and what problem it solves",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />

        {errors.pitch && <p className="startup-form_error">{errors.pitch}</p>}
      </div>

      <Button
        type="submit"
        className="startup-form_btn hover:opacity-[0.8] hover:text-white transition-all duration-200 ease-linear delay-100"
        disabled={isPending}
      >
        {isPending ? "Submitting..." : "Submit Your Pitch"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
};

export default StartupForm;
