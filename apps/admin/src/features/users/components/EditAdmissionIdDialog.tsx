import { FormModal } from '@/components/common/FormModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { useUpdateAdmissionId } from '../hooks';
import { User } from '../types/user.types';

const updateAdmissionIdSchema = z.object({
  admissionId: z.string().trim().regex(/^[0-9]{2}[A-Z]+[0-9]{3,}$/, 'Invalid Admission ID format. Example: 24IT001'),
});

type FormValues = z.infer<typeof updateAdmissionIdSchema>;

interface EditAdmissionIdDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditAdmissionIdDialog({ user, open, onOpenChange }: EditAdmissionIdDialogProps) {
  const { mutate, isPending } = useUpdateAdmissionId();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(updateAdmissionIdSchema),
    defaultValues: {
      admissionId: user.registerNumber || '',
    },
  });

  const onSubmit = (values: FormValues) => {
    mutate(
      { id: user.id, data: values },
      {
        onSuccess: () => {
          toast.success('Admission ID Updated', {
            description: `Login ID updated successfully to ${values.admissionId}.`,
          });
          reset();
          onOpenChange(false);
        },
        onError: (error: any) => {
          toast.error('Failed to update Admission ID', {
            description: error?.response?.data?.error?.message || 'An error occurred.',
          });
        },
      }
    );
  };

  return (
    <FormModal
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) reset();
        onOpenChange(isOpen);
      }}
      title="Change Admission ID"
      description="Update the student's Register Number. This will also update their Login ID."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <div>
          <label className="text-sm font-medium text-foreground">Current Admission ID</label>
          <p className="mt-1 text-sm text-muted-foreground">{user.registerNumber || 'None'}</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-foreground" htmlFor="admissionId">
            New Admission ID
          </label>
          <Input
            id="admissionId"
            placeholder="e.g. 24IT002"
            aria-invalid={!!errors.admissionId}
            {...register('admissionId')}
          />
          {errors.admissionId && (
            <p className="mt-1 text-xs text-destructive">{errors.admissionId.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset();
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Updating...' : 'Update'}
          </Button>
        </div>
      </form>
    </FormModal>
  );
}
