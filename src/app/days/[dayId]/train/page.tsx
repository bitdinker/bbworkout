import TrainCarouselClient from '@/components/TrainCarouselClient';

interface TrainPageProps {
  params: { dayId: string };
}

export default function TrainPage({ params }: TrainPageProps) {
  return <TrainCarouselClient dayId={params.dayId} />;
}
