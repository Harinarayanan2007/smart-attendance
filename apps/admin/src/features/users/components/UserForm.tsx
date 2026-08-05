import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBatchOptions } from '@/features/batches/hooks';
import { useDepartmentOptions } from '@/features/departments/hooks';
import { useProgramOptions } from '@/features/programs/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createUserSchema, userSchema } from '../schemas/user.schema';

interface UserFormProps {
  initialData?: any;
  onSubmit: (values: any) => void;
  isLoading: boolean;
  onCancel: () => void;
  isEditMode?: boolean;
}

export function UserForm({ initialData, onSubmit, isLoading, onCancel, isEditMode = false }: UserFormProps) {
  // Use appropriate schema based on mode
  const schema = isEditMode ? userSchema : createUserSchema;

  const form = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      name: '',
      email: '',
      password: '',
      phone: '',
      avatarUrl: '',
      role: '',
      departmentId: 'none',
      programId: 'none',
      batchId: 'none',
    },
  });

  const selectedRole = form.watch('role');
  const selectedDepartmentId = form.watch('departmentId');

  // Options Hooks
  const { data: departmentOptions } = useDepartmentOptions();
  const { data: programOptions } = useProgramOptions();
  const { data: batchOptions } = useBatchOptions();

  // Reset dependent fields on Role change
  useEffect(() => {
    if (!isEditMode) {
      form.setValue('departmentId', 'none');
      form.setValue('programId', 'none');
      form.setValue('batchId', 'none');
    }
  }, [selectedRole, form, isEditMode]);


  const handleSubmit = (values: any) => {
    // Clean up 'none' values to null/undefined before submission
    const cleanedValues = { ...values };
    if (cleanedValues.departmentId === 'none') cleanedValues.departmentId = null;
    if (cleanedValues.programId === 'none') cleanedValues.programId = null;
    if (cleanedValues.batchId === 'none') cleanedValues.batchId = null;
    
    onSubmit(cleanedValues);
  };

  const showDepartment = selectedRole === 'FACULTY' || selectedRole === 'STUDENT';
  const showProgramAndBatch = selectedRole === 'STUDENT';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address *</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!isEditMode && selectedRole === 'ADMIN' && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password *</FormLabel>
                  <FormControl>
                    <Input placeholder="••••••••" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1 234 567 890" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className={isEditMode ? 'col-span-2' : ''}>
                <FormLabel>Role *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ADMIN">Administrator</SelectItem>
                    <SelectItem value="FACULTY">Faculty</SelectItem>
                    <SelectItem value="STUDENT">Student</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {showDepartment && (
          <div className="space-y-4 pt-4 border-t mt-4">
            <h4 className="text-sm font-medium">Academic Assignment</h4>
            
            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || 'none'}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none" disabled>Select Department...</SelectItem>
                      {departmentOptions?.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showProgramAndBatch && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="programId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program *</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value || 'none'}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a program" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none" disabled>Select Program...</SelectItem>
                          {programOptions?.map((prog) => (
                            <SelectItem key={prog.id} value={prog.id}>
                              {prog.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="batchId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Batch / Academic Year *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || 'none'}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select batch" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none" disabled>Select Batch...</SelectItem>
                          {batchOptions?.map((ay) => (
                            <SelectItem key={ay.id} value={ay.id}>
                              {ay.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? 'Save Changes' : 'Create User'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
