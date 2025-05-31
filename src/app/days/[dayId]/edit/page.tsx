import EditDayPageClient from '@/components/EditDayPageClient';

interface EditDayPageProps {
  params: { dayId: string };
}

export default async function EditDayPage({ params }: EditDayPageProps) {
  // Await the params object before accessing its properties
  const resolvedParams = await Promise.resolve(params);
  const dayId = resolvedParams.dayId;
  
  return <EditDayPageClient dayId={dayId} />;
}
