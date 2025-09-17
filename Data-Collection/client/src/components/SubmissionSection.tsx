import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Upload, Send } from "lucide-react";
import type { ParticipantData } from "./MetadataForm";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

interface SubmissionSectionProps {
  images: Record<string, UploadedImage | null>;
  metadata: Partial<ParticipantData>;
  onSubmit: () => void;
}

export default function SubmissionSection({ images, metadata, onSubmit }: SubmissionSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const requiredImageSlots = ["skin1", "skin2", "skin3", "hair1", "hair2"];
  const requiredMetadataFields: (keyof ParticipantData)[] = [
    "name", "age", "gender", "city", "country", 
    "hairType", "hairLength", "hairDensity", "hairCondition", "scalpType",
    "recentTreatments", "scalpConditions"
  ];

  const uploadedImagesCount = requiredImageSlots.filter(slot => images[slot]).length;
  const completedMetadataCount = requiredMetadataFields.filter(field => {
    const value = metadata[field];
    return value && value.trim() !== "";
  }).length;

  const totalImages = requiredImageSlots.length;
  const totalMetadata = requiredMetadataFields.length;
  const isReadyToSubmit = uploadedImagesCount === totalImages && completedMetadataCount === totalMetadata;

  const handleSubmit = async () => {
    if (!isReadyToSubmit) return;

    setIsSubmitting(true);
    console.log("Submitting data:", { images, metadata });
    
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Add participant metadata
      formData.append('participantData', JSON.stringify(metadata));
      
      // Add image files
      Object.entries(images).forEach(([key, imageData]) => {
        if (imageData) {
          formData.append(key, imageData.file);
        }
      });
      
      // Submit to backend
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        setIsSubmitting(false);
        setShowConfirmation(true);
        onSubmit();
        console.log("Submission completed successfully:", result);
      } else {
        throw new Error(result.message || 'Submission failed');
      }
      
    } catch (error) {
      console.error("Submission error:", error);
      setIsSubmitting(false);
      // You could show an error message to the user here
      alert(`Submission failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (showConfirmation) {
    return (
      <Card className="border-2 border-chart-1">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-chart-1/10 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-chart-1" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Submission Successful!</h3>
              <p className="text-muted-foreground mt-2">
                Thank you for participating in our research study. Your data has been securely uploaded and will contribute to advancing AI research in hair and scalp analysis.
              </p>
            </div>
            <div className="bg-muted p-4 rounded-md text-left">
              <h4 className="font-medium text-foreground mb-2">What happens next?</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Your data will be processed and anonymized</li>
                <li>• Images will be analyzed using machine learning algorithms</li>
                <li>• Results will contribute to research publications</li>
                <li>• All data remains confidential and secure</li>
              </ul>
            </div>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
              data-testid="button-submit-another"
            >
              Submit Another Response
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Submit Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Submission Requirements */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {uploadedImagesCount === totalImages ? (
              <CheckCircle className="h-4 w-4 text-chart-1" />
            ) : (
              <AlertCircle className="h-4 w-4 text-chart-2" />
            )}
            <span className="text-sm">
              Photos: {uploadedImagesCount}/{totalImages} uploaded
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {completedMetadataCount === totalMetadata ? (
              <CheckCircle className="h-4 w-4 text-chart-1" />
            ) : (
              <AlertCircle className="h-4 w-4 text-chart-2" />
            )}
            <span className="text-sm">
              Information: {completedMetadataCount}/{totalMetadata} fields completed
            </span>
          </div>
        </div>

        {/* Submission Button */}
        <div className="pt-2">
          <Button
            onClick={handleSubmit}
            disabled={!isReadyToSubmit || isSubmitting}
            className="w-full"
            size="lg"
            data-testid="button-submit"
          >
            {isSubmitting ? (
              <>
                <Upload className="h-4 w-4 mr-2 animate-spin" />
                Uploading Data...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Research Data
              </>
            )}
          </Button>
          
          {!isReadyToSubmit && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Complete all photos and information to submit
            </p>
          )}
        </div>

        {/* Data Summary */}
        {isReadyToSubmit && (
          <div className="bg-muted p-3 rounded-md text-xs space-y-1">
            <p className="font-medium">Ready to submit:</p>
            <p>• {totalImages} photos (hair, scalp, face)</p>
            <p>• Complete participant information</p>
            <p>• All data will be encrypted and anonymized</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
