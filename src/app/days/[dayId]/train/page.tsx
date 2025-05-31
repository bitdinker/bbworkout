import TrainCarouselClient from '@/components/TrainCarouselClient';

interface TrainPageProps {
  params: { dayId: string };
}

export default async function TrainPage({ params }: TrainPageProps) {
  // Await the params object before accessing its properties
  const resolvedParams = await Promise.resolve(params);
  const dayId = resolvedParams.dayId;
  
  return <TrainCarouselClient dayId={dayId} />;
}
