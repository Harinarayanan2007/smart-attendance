import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { batchSchema, type BatchFormValues } from '../schemas/batch.schema';

interface BatchFormProps {
    initialValues?: Partial<BatchFormValues>;
    onSubmit: (values: BatchFormValues) => void;
    isLoading?: boolean;
    onCancel?: () => void;
}

export function BatchForm({ initialValues, onSubmit, isLoading, onCancel }: BatchFormProps) {
    const form = useForm<BatchFormValues>({
        resolver: zodResolver(batchSchema),
        defaultValues: {
            startYear: new Date().getFullYear(),
            ...initialValues,
        },
    });

    useEffect(() => {
        if (initialValues) {
            form.reset({
                startYear: initialValues.startYear ?? new Date().getFullYear(),
            });
        }
    }, [initialValues, form]);

    const handleSubmit = (values: BatchFormValues) => {
        onSubmit({
            ...values,
            startYear: Number(values.startYear)
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4" noValidate>
                <FormField
                    control={form.control}
                    name="startYear"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Start Year</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="e.g., 2024" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end gap-2 pt-4">
                    {onCancel && (
                        <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
                            Cancel
                        </Button>
                    )}
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
