import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, MapPin } from "lucide-react";

export interface ParticipantData {
  name: string;
  age: string;
  gender: string;
  city: string;
  country: string;
  hairType: string;
  hairLength: string;
  hairDensity: string;
  hairCondition: string;
  scalpType: string;
  recentTreatments: string;
  treatmentDetails: string;
  scalpConditions: string;
  conditionDetails: string;
}

interface MetadataFormProps {
  onDataChange: (data: Partial<ParticipantData>) => void;
  data: Partial<ParticipantData>;
}

export default function MetadataForm({ onDataChange, data }: MetadataFormProps) {
  const updateField = (field: keyof ParticipantData, value: string) => {
    const newData = { ...data, [field]: value };
    onDataChange(newData);
    console.log(`Updated ${field}:`, value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Participant Information
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Please provide accurate information for research purposes
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <User className="h-4 w-4" />
            Personal Details
          </h3>
          
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={data.name || ""}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Enter your full name"
                data-testid="input-name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={data.age || ""}
                  onChange={(e) => updateField("age", e.target.value)}
                  placeholder="Age"
                  min="18"
                  max="100"
                  data-testid="input-age"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={data.gender || ""} onValueChange={(value) => updateField("gender", value)}>
                  <SelectTrigger data-testid="select-gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={data.city || ""}
                onChange={(e) => updateField("city", e.target.value)}
                placeholder="City"
                data-testid="input-city"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={data.country || ""}
                onChange={(e) => updateField("country", e.target.value)}
                placeholder="Country"
                data-testid="input-country"
              />
            </div>
          </div>
        </div>

        {/* Hair Characteristics */}
        <div className="space-y-4">
          <h3 className="font-medium">Hair Characteristics</h3>
          
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Hair Type</Label>
              <Select value={data.hairType || ""} onValueChange={(value) => updateField("hairType", value)}>
                <SelectTrigger data-testid="select-hair-type">
                  <SelectValue placeholder="Select hair type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="straight">Straight</SelectItem>
                  <SelectItem value="wavy">Wavy</SelectItem>
                  <SelectItem value="curly">Curly</SelectItem>
                  <SelectItem value="coily">Coily</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Hair Length</Label>
                <Select value={data.hairLength || ""} onValueChange={(value) => updateField("hairLength", value)}>
                  <SelectTrigger data-testid="select-hair-length">
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Hair Density</Label>
                <Select value={data.hairDensity || ""} onValueChange={(value) => updateField("hairDensity", value)}>
                  <SelectTrigger data-testid="select-hair-density">
                    <SelectValue placeholder="Select density" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Hair Condition</Label>
              <Select value={data.hairCondition || ""} onValueChange={(value) => updateField("hairCondition", value)}>
                <SelectTrigger data-testid="select-hair-condition">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="dry">Dry</SelectItem>
                  <SelectItem value="oily">Oily</SelectItem>
                  <SelectItem value="dandruff">Dandruff</SelectItem>
                  <SelectItem value="hair-fall">Hair Fall</SelectItem>
                  <SelectItem value="itchy-scalp">Itchy Scalp</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Scalp Type</Label>
              <Select value={data.scalpType || ""} onValueChange={(value) => updateField("scalpType", value)}>
                <SelectTrigger data-testid="select-scalp-type">
                  <SelectValue placeholder="Select scalp type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="dry">Dry</SelectItem>
                  <SelectItem value="oily">Oily</SelectItem>
                  <SelectItem value="sensitive">Sensitive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Treatment History */}
        <div className="space-y-4">
          <h3 className="font-medium">Treatment & Condition History</h3>
          
          <div className="space-y-4">
            <div className="space-y-3">
              <Label>Any recent hair treatments?</Label>
              <RadioGroup 
                value={data.recentTreatments || ""} 
                onValueChange={(value) => updateField("recentTreatments", value)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="treatments-yes" data-testid="radio-treatments-yes" />
                  <Label htmlFor="treatments-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="treatments-no" data-testid="radio-treatments-no" />
                  <Label htmlFor="treatments-no">No</Label>
                </div>
              </RadioGroup>
              
              {data.recentTreatments === "yes" && (
                <div className="space-y-2">
                  <Label htmlFor="treatment-details">Please specify treatments</Label>
                  <Textarea
                    id="treatment-details"
                    value={data.treatmentDetails || ""}
                    onChange={(e) => updateField("treatmentDetails", e.target.value)}
                    placeholder="Describe recent treatments (coloring, perming, chemical straightening, etc.)"
                    rows={3}
                    data-testid="textarea-treatment-details"
                  />
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label>Any known skin/scalp conditions?</Label>
              <RadioGroup 
                value={data.scalpConditions || ""} 
                onValueChange={(value) => updateField("scalpConditions", value)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="conditions-yes" data-testid="radio-conditions-yes" />
                  <Label htmlFor="conditions-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="conditions-no" data-testid="radio-conditions-no" />
                  <Label htmlFor="conditions-no">No</Label>
                </div>
              </RadioGroup>
              
              {data.scalpConditions === "yes" && (
                <div className="space-y-2">
                  <Label htmlFor="condition-details">Please specify conditions</Label>
                  <Textarea
                    id="condition-details"
                    value={data.conditionDetails || ""}
                    onChange={(e) => updateField("conditionDetails", e.target.value)}
                    placeholder="Describe any skin/scalp conditions (eczema, psoriasis, allergies, etc.)"
                    rows={3}
                    data-testid="textarea-condition-details"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}