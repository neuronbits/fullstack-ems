import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { DEPARTMENTS } from '../assets/assets';
import { Loader2Icon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios.js';

const EmployeeForm = ({ initialData, onSuccess, onCancel }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const isEditMode = !!initialData;
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        if (isEditMode) {
            const pwd = formData.get('password');
            if (!pwd) formData.delete('password');
        }

        try {
            const url = isEditMode ? `/employees/${initialData.id}` : '/employees';
            const method = isEditMode ? 'PUT' : 'POST';
            await api[method](url, formData)
            onSuccess ? onSuccess() : navigate('/employees');

            // const res = await fetch(url, {
            //     method,
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data),
            // });

            // if (!res.ok) throw new Error('Failed to save employee');

            // const result = await res.json();
            // onSuccess(result);
        } catch (error) {
            toast.error(error.response?.data?.error || error.message);
            console.error('Error saving employee:', error);
            alert('Failed to save employee');
        } finally {
            setLoading(false);
        }

        const data = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            phone: formData.get('phone'),
            joinDate: formData.get('joinDate'),
            bio: formData.get('bio'),
            department: formData.get('department'),
            position: formData.get('position'),
            basicSalary: formData.get('basicSalary'),
            allowances: formData.get('allowances'),
            deductions: formData.get('deductions'),
            email: formData.get('email'),
            password: formData.get('password'),
            role: formData.get('role'),
        };
    }

    return (
        <form onSubmit={handleSubmit} className='space-y-6 max-w-3xl animate-fade-in'>
            <div className='card p-5 sm:p-6'>
                <h3 className='font-medium mb-6 pb-4 border-b border-slate-100'>Personal Information</h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700'>
                    <div>
                        <label className='block mb-2'>First Name</label>
                        <input name="firstName" type="text" required defaultValue={initialData?.firstName} />
                    </div>
                    <div>
                        <label className='block mb-2'>Last Name</label>
                        <input name="lastName" type="text" required defaultValue={initialData?.lastName} />
                    </div>
                    <div>
                        <label className='block mb-2'>Phone Number</label>
                        <input name="phone" type="text" required defaultValue={initialData?.phone} />
                    </div>
                    <div>
                        <label className='block mb-2'>Join Date</label>
                        <input name="joinDate" type="date" required defaultValue={initialData?.joinDate ? new Date(initialData.joinDate).toISOString().split('T')[0] : ""} />
                    </div>
                    <div className='sm:col-span-2'>
                        <label className='block mb-2'>Bio (Optional)</label>
                        <textarea name="bio" rows={3} defaultValue={initialData?.bio} className='resize-none' placeholder='Brief description...' />
                    </div>
                </div>
            </div>

            {/* Employment details */}
            <div className='card p-5 sm:p-6 '>
                <h3 className='font-medium mb-6 pb-4 border-b border-slate-100'>Employment Details</h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700'>
                    <div>
                        <label className='block mb-2'>Departments</label>
                        <select name="department" defaultValue={initialData?.department || ""} required>
                            <option value="">Select Department</option>
                            {DEPARTMENTS.map((deptName) => (
                                <option key={deptName} value={deptName}>{deptName}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className='block mb-2'>Position</label>
                        <input name="position" type="text" required defaultValue={initialData?.position} />
                    </div>
                    <div>
                        <label className='block mb-2'>Basic Salary</label>
                        <input name="basicSalary" type="number" required min="0" step="0.01 " defaultValue={initialData?.basicSalary || 0} />
                    </div>
                    <div>
                        <label className='block mb-2'>Allowances</label>
                        <input name="allowances" type="number" required min="0" step="0.01 " defaultValue={initialData?.allowances || 0} />
                    </div>
                    <div>
                        <label className='block mb-2'>Deductions</label>
                        <input name="allowances" type="number" required min="0" step="0.01 " defaultValue={initialData?.allowances || 0} />
                    </div>
                    {isEditMode && (
                        <div>
                            <label className='block mb-2'>Status</label>
                            <select name="employmentStatus" defaultValue={initialData?.employmentStatus || ""} required>
                                <option value="">Select Status</option>
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                            </select>
                        </div>
                    )}
                </div>
            </div>


            {/* Account Setup */}
            <div className='card p-5 sm:p-6'>
                <h3 className='text-base font-medium text-slate-900 mb-6 pb-4 border-b border-slate-100'>Account setup</h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700'>
                    <div className='sm:col-span-2'>
                        <label className='block mb-2'>Work Email</label>
                        <input name="email" type="email" required defaultValue={initialData?.email} />
                    </div>
                    {!isEditMode && (
                        <div>
                            <label className='block mb-2'>Temporary Password</label>
                            <input name="password" type="password" required />
                        </div>
                    )}
                    {isEditMode && (
                        <div>
                            <label className='block mb-2'>Change Password (Optional)</label>
                            <input name="password" type="password" placeholder='Leave blank to keep current' />
                        </div>
                    )}

                    <div>
                        <label className='block mb-2'>System Role</label>
                        <select name="role" defaultValue={initialData?.role || "EMPLOYEE"} required>
                            <option value="">Select Role</option>
                            <option value="EMPLOYEE">Employee</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                </div>
            </div>


            {/* button */}
            <div className='flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2'>
                <button type='button' onClick={() => (onCancel ? onCancel() : navigate(-1))} className='btn-secondary'>Cancel</button>
                <button type='submit' disabled={loading} className='btn-primary flex items-center justify-center'>{loading && <Loader2Icon className='w-4 h-4 mr-2 animate-spin' />} {isEditMode ? 'Update Employee' : 'Create Employee'}</button>
            </div>

        </form>
    )
}

export default EmployeeForm