import { useState } from "react";
import InstructionsSection from "@/components/InstructionsSection";
import ImageUploadSection from "@/components/ImageUploadSection";
import MetadataForm, { type ParticipantData } from "@/components/MetadataForm";
import ProgressTracker from "@/components/ProgressTracker";
import SubmissionSection from "@/components/SubmissionSection";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

export default function DataCollection() {
  const [images, setImages] = useState<Record<string, UploadedImage | null>>({
    skin1: null,
    skin2: null,
    skin3: null,
    hair1: null,
    hair2: null,
  });

  const [metadata, setMetadata] = useState<Partial<ParticipantData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmission = () => {
    setIsSubmitted(true);
    // todo: remove mock functionality - integrate with real backend
    console.log("Final submission:", { images, metadata });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Research Data Collection
          </h1>
          <p className="text-muted-foreground">
            AI Model Training Study - Hair & Scalp Analysis
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Instructions */}
            <InstructionsSection />
            
            {/* Image Upload */}
            <ImageUploadSection onImagesChange={setImages} />
            
            {/* Metadata Form */}
            <MetadataForm 
              data={metadata}
              onDataChange={setMetadata}
            />
            
            {/* Submission */}
            <SubmissionSection
              images={images}
              metadata={metadata}
              onSubmit={handleSubmission}
            />
          </div>

          {/* Sidebar - Progress Tracker */}
          <div className="lg:col-span-1">
            <ProgressTracker 
              images={images}
              metadata={metadata}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2024 Research Data Collection Platform</p>
          <p className="mt-1">
            Secure • Anonymous • Research Ethics Compliant
          </p>
        </div>
      </div>
    </div>
  );
}
