import ProgressTracker from '../ProgressTracker';

export default function ProgressTrackerExample() {
  // todo: remove mock functionality
  const mockImages = {
    hair1: { id: "hair1", file: new File([], "hair1.jpg"), preview: "data:image/jpeg;base64,mock" },
    hair2: null,
    scalp1: { id: "scalp1", file: new File([], "scalp1.jpg"), preview: "data:image/jpeg;base64,mock" },
    scalp2: null,
    scalp3: null,
    face: null,
  };

  const mockMetadata = {
    name: "John Doe",
    age: "28",
    gender: "male",
    city: "San Francisco",
    hairType: "wavy",
  };

  return (
    <ProgressTracker 
      images={mockImages}
      metadata={mockMetadata}
    />
  );
}