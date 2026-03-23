/**
 * EVENT DETAIL PAGE
 * Screen ID: AD-EVENT-DETAIL-01
 * 
 * Detailed event view with all information sections
 */

import { useState } from 'react';
import { ChevronLeft, Calendar, MapPin, Edit2, Plus, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface Event {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  numberOfInvites: number;
  venueName: string;
  status: 'upcoming' | 'past';
  bannerUrl: string;
  description: string;
}

interface CustomerPass {
  id: string;
  datetime: string;
  customerName: string;
  phone: string;
  numberOfPasses: number;
  notes: string;
}

const mockPasses: CustomerPass[] = [
  {
    id: '1',
    datetime: '2025-04-10T10:30',
    customerName: 'John Doe',
    phone: '+1 234 567 8900',
    numberOfPasses: 2,
    notes: 'VIP guest',
  },
  {
    id: '2',
    datetime: '2025-04-11T14:15',
    customerName: 'Jane Smith',
    phone: '+1 987 654 3210',
    numberOfPasses: 1,
    notes: 'Early bird registration',
  }
];

interface EventDetailProps {
  event: Event;
  onBack: () => void;
  onEdit: (event: Event) => void;
}

export default function EventDetail({ event, onBack, onEdit }: EventDetailProps) {
  const [activeTab, setActiveTab] = useState('details');
  const [passes, setPasses] = useState<CustomerPass[]>(mockPasses);
  
  // Dialog state
  const [isAddPassOpen, setIsAddPassOpen] = useState(false);
  const [isViewPassOpen, setIsViewPassOpen] = useState(false);
  const [selectedPass, setSelectedPass] = useState<CustomerPass | null>(null);
  const [isEditingPass, setIsEditingPass] = useState(false);

  // Form state
  const [passForm, setPassForm] = useState<Partial<CustomerPass>>({});

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canEdit = true;

  const handleOpenAddPass = () => {
    setPassForm({
      customerName: '',
      phone: '+1 ',
      numberOfPasses: 1,
      notes: ''
    });
    setIsAddPassOpen(true);
  };

  const handleSaveAddPass = () => {
    const newPass: CustomerPass = {
      id: Math.random().toString(),
      datetime: new Date().toISOString(),
      customerName: passForm.customerName || '',
      phone: passForm.phone || '',
      numberOfPasses: passForm.numberOfPasses || 1,
      notes: passForm.notes || '',
    };
    setPasses([newPass, ...passes]);
    setIsAddPassOpen(false);
  };

  const handleOpenViewPass = (pass: CustomerPass) => {
    setSelectedPass(pass);
    setPassForm({
      customerName: pass.customerName,
      phone: pass.phone,
      numberOfPasses: pass.numberOfPasses,
      notes: pass.notes,
    });
    setIsEditingPass(false);
    setIsViewPassOpen(true);
  };

  const handleSaveEditPass = () => {
    if (!selectedPass) return;
    setPasses(passes.map(p => p.id === selectedPass.id ? { ...p, ...passForm } as CustomerPass : p));
    setIsEditingPass(false);
    setSelectedPass({ ...selectedPass, ...passForm } as CustomerPass);
  };

  const renderPassFormContent = (isViewing: boolean = false) => {
    const isDisabled = isViewing && !isEditingPass;
    
    return (
      <div className="space-y-4 py-4">
        <div>
          <Label className="text-neutral-500 mb-2 block">Customer</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
            <Input 
              placeholder="Search customer..." 
              className="pl-9"
              value={passForm.customerName || ''}
              onChange={e => setPassForm({...passForm, customerName: e.target.value})}
              disabled={isDisabled}
            />
          </div>
        </div>

        <div>
          <Label className="text-neutral-500 mb-2 block">Phone Number</Label>
          <Input 
            type="tel"
            value={passForm.phone || ''}
            onChange={e => setPassForm({...passForm, phone: e.target.value})}
            disabled={isDisabled}
          />
        </div>

        <div>
          <Label className="text-neutral-500 mb-2 block">Number of Passes</Label>
          <Input 
            type="number"
            min="1"
            value={passForm.numberOfPasses || 1}
            onChange={e => setPassForm({...passForm, numberOfPasses: parseInt(e.target.value)})}
            disabled={isDisabled}
          />
        </div>

        <div>
          <Label className="text-neutral-500 mb-2 block">Notes</Label>
          <Textarea 
            placeholder="Add any additional notes..."
            value={passForm.notes || ''}
            onChange={e => setPassForm({...passForm, notes: e.target.value})}
            disabled={isDisabled}
            rows={3}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 mb-4 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Events
        </button>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl">{event.title}</h1>
              <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
                {event.status}
              </Badge>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
              Event Management → Events → {event.title}
            </p>
          </div>
          {canEdit && activeTab === 'details' && (
            <Button onClick={() => onEdit(event)}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Event
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 border-b border-transparent w-full justify-start rounded-none h-auto p-0 bg-transparent flex gap-6">
          <TabsTrigger 
            value="details"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 text-base h-auto data-[state=active]:text-primary-600"
          >
            Event Details
          </TabsTrigger>
          <TabsTrigger 
            value="passes"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 py-3 text-base h-auto data-[state=active]:text-primary-600"
          >
            Customer Passes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="max-w-5xl space-y-6">
            {/* Section 1 - Event Info */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
              <h2 className="text-lg font-medium mb-6">Event Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                    Event Title
                  </label>
                  <p className="text-lg font-medium">{event.title}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                      Start Date
                    </label>
                    <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
                      <Calendar className="w-5 h-5 text-neutral-500" />
                      <p className="font-medium">{formatDate(event.startDate)}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                      End Date
                    </label>
                    <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
                      <Calendar className="w-5 h-5 text-neutral-500" />
                      <p className="font-medium">{formatDate(event.endDate)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                    Venue Name
                  </label>
                  <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
                    <MapPin className="w-5 h-5 text-neutral-500" />
                    <p className="font-medium">{event.venueName}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                    Description
                  </label>
                  <div className="prose prose-neutral dark:prose-invert max-w-none px-4 py-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 - Event Banner */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6">
              <h2 className="text-lg font-medium mb-6">Event Banner</h2>
              
              <div className="relative w-full h-96 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800">
                <img
                  src={event.bannerUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {canEdit && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-3">
                  Click "Edit Event" to replace this banner image
                </p>
              )}
            </div>



            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <Button variant="outline" onClick={onBack}>
                Back to Events
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="passes">
          <div className="max-w-6xl space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Customer Passes</h2>
              <Button onClick={handleOpenAddPass}>
                <Plus className="w-4 h-4 mr-2" />
                Add New Record
              </Button>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Date and time</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Customer Name</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Phone</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Number of passes</th>
                      <th className="text-left px-6 py-4 text-sm font-medium text-neutral-500">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {passes.length === 0 ? (
                       <tr>
                         <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                           No customer passes found.
                         </td>
                       </tr>
                    ) : passes.map((pass) => (
                      <tr
                        key={pass.id}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
                        onClick={() => handleOpenViewPass(pass)}
                      >
                        <td className="px-6 py-4 text-sm">{formatDateTime(pass.datetime)}</td>
                        <td className="px-6 py-4 text-sm font-medium">{pass.customerName}</td>
                        <td className="px-6 py-4 text-sm">{pass.phone}</td>
                        <td className="px-6 py-4 text-sm">{pass.numberOfPasses}</td>
                        <td className="px-6 py-4 text-sm text-neutral-500 truncate max-w-[200px]">
                          {pass.notes || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Pass Dialog */}
      <Dialog open={isAddPassOpen} onOpenChange={setIsAddPassOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Customer Pass</DialogTitle>
          </DialogHeader>
          {renderPassFormContent(false)}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPassOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAddPass}>
              Save Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View/Edit Pass Dialog */}
      <Dialog open={isViewPassOpen} onOpenChange={setIsViewPassOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="flex flex-row items-center justify-between mt-2">
            <DialogTitle>
              {isEditingPass ? 'Edit Customer Pass' : 'View Customer Pass'}
            </DialogTitle>
          </DialogHeader>
          
          {renderPassFormContent(true)}
          
          <DialogFooter className="mt-4">
            {isEditingPass ? (
              <>
                <Button variant="outline" onClick={() => {
                  setIsEditingPass(false);
                  setPassForm({
                    customerName: selectedPass?.customerName,
                    phone: selectedPass?.phone,
                    numberOfPasses: selectedPass?.numberOfPasses,
                    notes: selectedPass?.notes,
                  });
                }}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEditPass}>
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditingPass(true)} className="w-full sm:w-auto">
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Details
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}