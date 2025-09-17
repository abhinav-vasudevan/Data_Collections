import { useState } from 'react';
import MetadataForm, { type ParticipantData } from '../MetadataForm';

export default function MetadataFormExample() {
  const [data, setData] = useState<Partial<ParticipantData>>({});
  
  return (
    <MetadataForm 
      data={data}
      onDataChange={(newData) => setData(newData)}
    />
  );
}