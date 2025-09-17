import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check, Circle, AlertTriangle } from "lucide-react";
import type { ParticipantData } from "./MetadataForm";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

interface ProgressTrackerProps {
  images: Record<string, UploadedImage | null>;
  metadata: Partial<ParticipantData>;
}

export default function ProgressTracker({ images, metadata }: ProgressTrackerProps) {
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
  const totalTasks = totalImages + totalMetadata;
  const completedTasks = uploadedImagesCount + completedMetadataCount;
  const progressPercentage = (completedTasks / totalTasks) * 100;

  const isReadyToSubmit = uploadedImagesCount === totalImages && completedMetadataCount === totalMetadata;

  const getStepStatus = (completed: number, total: number) => {
    if (completed === total) return "complete";
    if (completed > 0) return "partial";
    return "pending";
  };

  const imageStatus = getStepStatus(uploadedImagesCount, totalImages);
  const metadataStatus = getStepStatus(completedMetadataCount, totalMetadata);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete": return <Check className="h-4 w-4 text-chart-1" />;
      case "partial": return <Circle className="h-4 w-4 text-chart-2" />;
      default: return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string, completed: number, total: number) => {
    switch (status) {
      case "complete":
        return <Badge className="bg-chart-1/10 text-chart-1 border-chart-1/20">Complete</Badge>;
      case "partial":
        return <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/20">{completed}/{total}</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Submission Progress</CardTitle>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Overall Progress</span>
            <span className="font-medium">{completedTasks}/{totalTasks} tasks</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {Math.round(progressPercentage)}% complete
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Photo Upload Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(imageStatus)}
              <span className="font-medium">Photo Uploads</span>
            </div>
            {getStatusBadge(imageStatus, uploadedImagesCount, totalImages)}
          </div>
          <div className="ml-6 space-y-1">
            {requiredImageSlots.map((slot) => {
              const isUploaded = !!images[slot];
              const labels: Record<string, string> = {
                skin1: "Skin Photo 1",
                skin2: "Skin Photo 2",
                skin3: "Skin Photo 3",
                hair1: "Hair/Scalp Photo 1",
                hair2: "Hair/Scalp Photo 2",
              };
              
              return (
                <div key={slot} className="flex items-center gap-2 text-sm">
                  {isUploaded ? (
                    <Check className="h-3 w-3 text-chart-1" />
                  ) : (
                    <Circle className="h-3 w-3 text-muted-foreground" />
                  )}
                  <span className={isUploaded ? "text-foreground" : "text-muted-foreground"}>
                    {labels[slot]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Metadata Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(metadataStatus)}
              <span className="font-medium">Information Form</span>
            </div>
            {getStatusBadge(metadataStatus, completedMetadataCount, totalMetadata)}
          </div>
          <div className="ml-6 text-sm text-muted-foreground">
            {completedMetadataCount} of {totalMetadata} fields completed
          </div>
        </div>

        {/* Submission Status */}
        <div className="pt-2 border-t">
          {isReadyToSubmit ? (
            <div className="flex items-center gap-2 text-chart-1">
              <Check className="h-4 w-4" />
              <span className="font-medium">Ready to Submit</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertTriangle className="h-4 w-4" />
              <span>Complete all sections to submit</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
