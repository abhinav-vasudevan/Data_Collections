import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Camera } from "lucide-react";
import hairBackImage from "@assets/generated_images/Hair_photo_example_back_view_752e2a6b.png";
import scalpTopImage from "@assets/generated_images/Scalp_photo_example_top_view_cb0ac3cd.png";
import faceImage from "@assets/generated_images/Face_photo_example_frontal_view_519cc774.png";
import hairSideImage from "@assets/generated_images/Hair_photo_example_side_view_086717be.png";


export default function InstructionsSection() {
  const photoExamples = [
    { title: "Skin Photo 1", subtitle: "Front View", image: faceImage },
    { title: "Skin Photo 2", subtitle: "Left View", image: hairSideImage },
    { title: "Skin Photo 3", subtitle: "Right View", image: hairSideImage },
    { title: "Hair/Scalp Photo 1", subtitle: "Top View", image: scalpTopImage },
    { title: "Hair/Scalp Photo 2", subtitle: "Back View", image: hairBackImage },
  ];

  return (
    <div className="space-y-6">
      {/* Study Explanation */}
      <Card className="border-2 border-chart-1">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="h-5 w-5 text-chart-1" />
            Research Study Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground">
              You are participating in a research study to help develop an AI model for hair and scalp analysis. 
              Your contribution will advance scientific understanding and medical applications.
            </p>
            
            <div className="bg-muted p-4 rounded-md">
              <h4 className="font-medium text-foreground mb-2">Consent & Privacy</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• All data collected will be used solely for research purposes</li>
                <li>• Your images and information will be anonymized</li>
                <li>• Participation is voluntary and you can withdraw at any time</li>
                <li>• Data will be securely stored and handled according to research ethics guidelines</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photo Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Photo Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">5</Badge>
              <span className="text-sm">Total photos required</span>
            </div>
            
            <div className="space-y-2 text-sm">
              <p className="font-medium">Photo Guidelines:</p>
              <ul className="text-muted-foreground space-y-1 ml-4">
                <li>• Take photos in good natural lighting</li>
                <li>• Use a clean, plain background when possible</li>
                <li>• No filters, editing, or effects</li>
                <li>• Photos should be clear and in focus</li>
                <li>• Remove hats, headbands, or hair accessories</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Example Photos Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Example Photos</CardTitle>
          <p className="text-sm text-muted-foreground">
            Follow these examples for best results
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {photoExamples.map((example, index) => (
              <div key={index} className="space-y-2">
                <div className="aspect-[3/4] rounded-md overflow-hidden border">
                  <img 
                    src={example.image} 
                    alt={`${example.title} example`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <Badge variant="secondary" className="text-xs">
                    {example.title}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {example.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
