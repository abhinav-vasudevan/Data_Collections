import ImageUploadSection from '../ImageUploadSection';

export default function ImageUploadSectionExample() {
  return (
    <ImageUploadSection 
      onImagesChange={(images) => console.log('Images changed:', images)} 
    />
  );
}