
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

import { createProgramSchema, type ProgramFormValues } from '../schemas/program.schema';
import type { Program } from '../types/program.types';

interface ProgramFormProps {
    initialData?: Program;
    onSubmit: (data: ProgramFormValues) => void;
    onCancel?: () => void;
    isLoading?: boolean;
}

export function ProgramForm({ initialData, onSubmit, onCancel, isLoading }: ProgramFormProps) {

    const form = useForm<ProgramFormValues>({
        resolver: zodResolver(createProgramSchema),
        defaultValues: {
            name: initialData?.name || '',
            code: initialData?.code || '',
            durationYears: initialData?.durationYears || 4,
            description: initialData?.description || '',
            isActive: initialData !== undefined ? initialData.isActive : true,
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name,
                code: initialData.code,
                durationYears: initialData.durationYears,
                description: initialData.description || '',
                isActive: initialData.isActive,
            });
        }
    }, [initialData, form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Program Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Bachelor of Computer Science" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Program Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. BCS" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control}
                        name="durationYears"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Duration (Years)</FormLabel>
                                <FormControl>
                                    <Input 
                                        type="number" 
                                        min={1} 
                                        max={10} 
                                        {...field} 
                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} 
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter program details..."
                                    className="resize-none"
                                    {...field}
                                    value={field.value || ''}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Active Status</FormLabel>
                                <div className="text-sm text-muted-foreground">
                                    Inactive programs cannot be assigned to new students or batches.
                                </div>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Saving...' : initialData ? 'Update Program' : 'Create Program'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
