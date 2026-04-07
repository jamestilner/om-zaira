/**
 * EVENT MANAGEMENT
 * Screen ID: AD-EVENT-LIST-01
 * 
 * Event management with grid/table views and filtering
 * Based on /src/imports/event-management-specs.md specifications
 */

import { useState, useMemo } from 'react';
import {
  Calendar,
  MapPin,
  Plus,
  Clock,
  Users,
} from 'lucide-react';
import { ListHeader, ViewMode } from './hb/common/ListHeader';
import { FilterDrawer, FilterField } from './hb/common/FilterDrawer';
import { Pagination } from './hb/common/Pagination';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import AddEvent from './AddEvent';
import { toast } from 'sonner';

// Event interface
interface Event {
  id: string;
  title: string;
  startDate: string;
  startTime: string;
  numberOfInvites: number;
  venueName: string;
  status: 'Active' | 'Inactive';
  bannerUrl: string;
  description: string;
}

// Mock event data
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Annual Tech Summit 2025',
    startDate: '2025-04-15',
    startTime: '09:00',
    numberOfInvites: 500,
    venueName: 'Grand Convention Center',
    status: 'Active',
    bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
    description: 'Join us for the biggest technology summit of the year featuring keynote speakers, workshops, and networking opportunities with industry leaders.',
  },
  {
    id: '2',
    title: 'Community Health Fair',
    startDate: '2025-03-20',
    startTime: '10:00',
    numberOfInvites: 150,
    venueName: 'City Community Hall',
    status: 'Active',
    bannerUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800',
    description: 'A comprehensive health fair offering free health screenings, consultations, and wellness workshops for the entire community.',
  },
  {
    id: '3',
    title: 'Digital Marketing Masterclass',
    startDate: '2025-05-10',
    startTime: '13:00',
    numberOfInvites: 50,
    venueName: 'Innovation Hub',
    status: 'Active',
    bannerUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
    description: 'Master the art of digital marketing with expert trainers covering SEO, social media marketing, content strategy, and analytics.',
  },
  {
    id: '4',
    title: 'New Year Celebration Gala',
    startDate: '2025-01-01',
    startTime: '20:00',
    numberOfInvites: 200,
    venueName: 'Royal Ballroom',
    status: 'Inactive',
    bannerUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
    description: 'Ring in the new year with an elegant gala featuring live music, gourmet dining, and spectacular fireworks display.',
  },
  {
    id: '5',
    title: 'Environmental Awareness Campaign',
    startDate: '2025-02-28',
    startTime: '08:00',
    numberOfInvites: 300,
    venueName: 'Green Valley Resort',
    status: 'Inactive',
    bannerUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800',
    description: 'An interactive campaign focused on environmental conservation, sustainable living, and climate action strategies.',
  },
];

export default function EventManagement() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const itemsPerPage = viewMode === 'table' ? 10 : 12;

  // Filter and search
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === 'all' || event.status === selectedStatus;

      const matchesDateRange = (() => {
        if (!dateRange.from && !dateRange.to) return true;
        const eventDate = new Date(event.startDate);
        const fromDate = dateRange.from ? new Date(dateRange.from) : null;
        const toDate = dateRange.to ? new Date(dateRange.to) : null;

        if (fromDate && toDate) {
          return eventDate >= fromDate && eventDate <= toDate;
        } else if (fromDate) {
          return eventDate >= fromDate;
        } else if (toDate) {
          return eventDate <= toDate;
        }
        return true;
      })();

      return matchesSearch && matchesStatus && matchesDateRange;
    });
  }, [events, searchQuery, selectedStatus, dateRange]);

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Statistics
  const stats = useMemo(() => {
    return {
      total: events.length,
      upcoming: events.filter((e) => e.status === 'Active').length,
    };
  }, [events]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsAddingEvent(true);
  };

  const handleSaveEvent = (eventData: any) => {
    if (editingEvent) {
      // Update existing event
      setEvents((prev) =>
        prev.map((e) =>
          e.id === editingEvent.id
            ? {
                ...e,
                ...eventData,
                id: e.id,
              }
            : e
        )
      );
      toast.success('Event updated successfully');
    } else {
      // Add new event
      const newEvent: Event = {
        id: (events.length + 1).toString(),
        ...eventData,
      };
      setEvents((prev) => [...prev, newEvent]);
      toast.success('Event created successfully');
    }
    setIsAddingEvent(false);
    setEditingEvent(null);
  };

  const handleResetFilters = () => {
    setSelectedStatus('all');
    setDateRange({ from: '', to: '' });
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
  };

  // Show add/edit view
  if (isAddingEvent) {
    return (
      <AddEvent
        event={editingEvent}
        onBack={() => {
          setIsAddingEvent(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Events</p>
              <p className="text-3xl mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Active Events</p>
              <p className="text-3xl mt-1">{stats.upcoming}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* List Header */}
      <ListHeader
        title="Event Management"
        breadcrumbs={[
          { label: 'Event Management' },
          { label: 'Events' },
        ]}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onAddNew={() => setIsAddingEvent(true)}
        addNewLabel="Add New Event"
      />

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      >


        <FilterField label="Event Status">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </FilterField>

        <FilterField label="Date Range">
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="flex-1 h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <span className="text-neutral-500 dark:text-neutral-400">to</span>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="flex-1 h-10 px-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </FilterField>
      </FilterDrawer>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
              onClick={() => handleEditEvent(event)}
            >
              <div className="relative h-48 bg-neutral-200 dark:bg-neutral-800">
                <img
                  src={event.bannerUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Badge variant={event.status === 'Active' ? 'default' : 'secondary'}>
                    {event.status}
                  </Badge>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <h3 className="line-clamp-2 font-medium text-lg">{event.title}</h3>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span className="line-clamp-1">
                      {formatDate(event.startDate)} at {event.startTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                <tr>
                  <th className="text-left px-6 py-3 text-sm">Event Title</th>
                  <th className="text-left px-6 py-3 text-sm">Start Date</th>
                  <th className="text-left px-6 py-3 text-sm">Start Time</th>
                  <th className="text-left px-6 py-3 text-sm">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {paginatedEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
                    onClick={() => handleEditEvent(event)}
                  >
                    <td className="px-6 py-4">
                      <span className="font-medium line-clamp-1">{event.title}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm">{formatDate(event.startDate)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm">{event.startTime}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={event.status === 'Active' ? 'default' : 'secondary'}>
                        {event.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredEvents.length}
          itemsPerPage={itemsPerPage}
        />
      )}

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
          <p className="text-neutral-500 dark:text-neutral-400">No events found</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setIsAddingEvent(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Event
          </Button>
        </div>
      )}
    </div>
  );
}