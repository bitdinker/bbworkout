import EditDayPageClient from '@/components/EditDayPageClient';

interface EditDayPageProps {
  params: { dayId: string };
}

export default function EditDayPage({ params }: EditDayPageProps) {
  return <EditDayPageClient dayId={params.dayId} />;
}
