import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Check, X } from "lucide-react";

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

interface ImageUploadSectionProps {
  onImagesChange: (images: Record<string, UploadedImage | null>) => void;
}

export default function ImageUploadSection({ onImagesChange }: ImageUploadSectionProps) {
  const [uploadedImages, setUploadedImages] = useState<Record<string, UploadedImage | null>>({
    skin1: null,
    skin2: null,
    skin3: null,
    hair1: null,
    hair2: null,
  });

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const uploadSlots = [
    { id: "skin1", title: "Skin Photo 1", subtitle: "Front View", category: "skin" },
    { id: "skin2", title: "Skin Photo 2", subtitle: "Left View", category: "skin" },
    { id: "skin3", title: "Skin Photo 3", subtitle: "Right View", category: "skin" },
    { id: "hair1", title: "Hair/Scalp Photo 1", subtitle: "Top View", category: "hair" },
    { id: "hair2", title: "Hair/Scalp Photo 2", subtitle: "Back View", category: "hair" },
  ];

  const handleFileSelect = (slotId: string, file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const newImage: UploadedImage = {
        id: slotId,
        file,
        preview: e.target?.result as string,
      };

      const newImages = {
        ...uploadedImages,
        [slotId]: newImage,
      };

      setUploadedImages(newImages);
      onImagesChange(newImages);
      console.log(`Image uploaded for ${slotId}:`, file.name);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (slotId: string) => {
    const newImages = {
      ...uploadedImages,
      [slotId]: null,
    };
    setUploadedImages(newImages);
    onImagesChange(newImages);
    console.log(`Image removed for ${slotId}`);
  };

  const triggerFileInput = (slotId: string, useCamera = false) => {
    const input = fileInputRefs.current[slotId];
    if (input) {
      if (useCamera) {
        input.setAttribute("capture", "environment");
      } else {
        input.removeAttribute("capture");
      }
      input.click();
      console.log(`${useCamera ? 'Camera' : 'File'} input triggered for ${slotId}`);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "hair": return "chart-2";
      case "skin": return "chart-1";
      default: return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Photos
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Upload or take 5 photos as shown in the examples above
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {uploadSlots.map((slot) => {
            const uploaded = uploadedImages[slot.id];
            const isUploaded = !!uploaded;

            return (
              <div key={slot.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`bg-${getCategoryColor(slot.category)}/10 border-${getCategoryColor(slot.category)}/20`}
                    >
                      {slot.title}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{slot.subtitle}</span>
                  </div>
                  {isUploaded && (
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-chart-1" />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeImage(slot.id)}
                        data-testid={`button-remove-${slot.id}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {isUploaded ? (
                  <div className="flex gap-4">
                    <div className="w-20 h-24 rounded-md overflow-hidden border">
                      <img 
                        src={uploaded.preview} 
                        alt={`Uploaded ${slot.title}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-sm font-medium">{uploaded.file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(uploaded.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => triggerFileInput(slot.id, false)}
                          data-testid={`button-replace-${slot.id}`}
                        >
                          Replace
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      variant="outline"
                      onClick={() => triggerFileInput(slot.id, true)}
                      data-testid={`button-camera-${slot.id}`}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Take Photo
                    </Button>
                    <Button
                      className="flex-1"
                      variant="outline"
                      onClick={() => triggerFileInput(slot.id, false)}
                      data-testid={`button-upload-${slot.id}`}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                  </div>
                )}

                <input
                  ref={(el) => (fileInputRefs.current[slot.id] = el)}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(slot.id, file);
                  }}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
