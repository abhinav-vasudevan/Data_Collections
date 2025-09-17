import SubmissionSection from '../SubmissionSection';

export default function SubmissionSectionExample() {
  // todo: remove mock functionality
  const mockImages = {
    hair1: { id: "hair1", file: new File([], "hair1.jpg"), preview: "data:image/jpeg;base64,mock" },
    hair2: { id: "hair2", file: new File([], "hair2.jpg"), preview: "data:image/jpeg;base64,mock" },
    scalp1: { id: "scalp1", file: new File([], "scalp1.jpg"), preview: "data:image/jpeg;base64,mock" },
    scalp2: { id: "scalp2", file: new File([], "scalp2.jpg"), preview: "data:image/jpeg;base64,mock" },
    scalp3: { id: "scalp3", file: new File([], "scalp3.jpg"), preview: "data:image/jpeg;base64,mock" },
    face: { id: "face", file: new File([], "face.jpg"), preview: "data:image/jpeg;base64,mock" },
  };

  const mockMetadata = {
    name: "John Doe",
    age: "28",
    gender: "male",
    city: "San Francisco",
    country: "USA",
    hairType: "wavy",
    hairLength: "medium",
    hairDensity: "medium", 
    hairCondition: "normal",
    scalpType: "normal",
    recentTreatments: "no",
    scalpConditions: "no",
  };

  return (
    <SubmissionSection 
      images={mockImages}
      metadata={mockMetadata}
      onSubmit={() => console.log('Submission completed')}
    />
  );
}