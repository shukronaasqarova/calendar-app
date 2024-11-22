import React, { useState } from 'react';

type Event = {
  id: number;
  date: Date;
  title: string;
};

const CalendarHeader: React.FC<{
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}> = ({ currentDate, onPrevMonth, onNextMonth }) => {
  return (
    <div className="flex justify-between items-center bg-blue-500 text-white p-4">
      <button onClick={onPrevMonth} className="text-2xl">&lt;</button>
      <h2 className="text-xl font-bold">
        {currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
      </h2>
      <button onClick={onNextMonth} className="text-2xl">&gt;</button>
    </div>
  );
};

const EventList: React.FC<{ events: Event[] }> = ({ events }) => {
  const displayEvents = events.slice(0, 3);

  return (
    <div className="mt-1">
      {displayEvents.map((event) => (
        <div key={event.id} className="bg-blue-200 text-blue-800 text-xs p-1 mb-1 rounded">
          {event.title}
        </div>
      ))}
      {events.length > 3 && (
        <div className="text-xs text-gray-500">+{events.length - 3} more</div>
      )}
    </div>
  );
};

const CalendarGrid: React.FC<{
  currentDate: Date;
  events: Event[];
  onDateClick: (date: Date) => void;
}> = ({ currentDate, events, onDateClick }) => {
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  return (
    <div className="grid grid-cols-7 gap-1 bg-white p-2">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
        <div key={day} className="text-center font-bold text-gray-500 p-2">
          {day}
        </div>
      ))}
      {days.map((date, index) => (
        <div
          key={index}
          className={`p-2 border ${
            !date ? 'bg-gray-100' : 'hover:bg-gray-100 cursor-pointer'
          } ${
            date && date.toDateString() === new Date().toDateString()
              ? 'bg-yellow-200'
              : ''
          }`}
          onClick={() => date && onDateClick(date)}
        >
          {date && (
            <>
              <div className="font-bold">{date.getDate()}</div>
              <EventList
                events={events.filter(
                  (event) => event.date.toDateString() === date.toDateString()
                )}
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
};

const EventModal: React.FC<{
  date: Date;
  onClose: () => void;
  onAddEvent: (event: Event) => void;
}> = ({ date, onClose, onAddEvent }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddEvent({ id: Date.now(), date, title });
      setTitle('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          Add Event for {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event title"
            maxLength={30}
            required
            className="w-full p-2 border rounded"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const nextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const prevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleAddEvent = (newEvent: Event) => {
    setEvents([...events, newEvent]);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={prevMonth}
        onNextMonth={nextMonth}
      />
      <CalendarGrid
        currentDate={currentDate}
        events={events}
        onDateClick={handleDateClick}
      />
      {isModalOpen && selectedDate && (
        <EventModal
          date={selectedDate}
          onClose={() => setIsModalOpen(false)}
          onAddEvent={handleAddEvent}
        />
      )}
    </div>
  );
};
const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-6">Calendar App</h1>
        <Calendar />
      </div>
    </div>
  );
};

export default App;