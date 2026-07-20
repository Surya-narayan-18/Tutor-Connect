import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyTutorProfile, updateAvailability } from '../../store/slices/tutorsSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { capitalize, formatTime } from '../../utils/helpers';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const TIME_SLOTS = [];
for (let h = 6; h < 22; h++) {
  TIME_SLOTS.push(`${String(h).padStart(2, '0')}:00`);
}

const TutorAvailability = () => {
  const dispatch = useDispatch();
  const { myAvailability, loading, error } = useSelector((s) => s.tutors);
  const [slots, setSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({ dayOfWeek: 'monday', startTime: '09:00', endTime: '10:00' });
  const [success, setSuccess] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => { dispatch(fetchMyTutorProfile()); }, [dispatch]);

  useEffect(() => {
    if (myAvailability) {
      setSlots(myAvailability.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
        isBooked: s.isBooked,
        _id: s._id,
      })));
    }
  }, [myAvailability]);

  const addSlot = () => {
    if (newSlot.startTime >= newSlot.endTime) {
      setFormError('End time must be after start time');
      return;
    }
    const exists = slots.some(
      (s) => s.dayOfWeek === newSlot.dayOfWeek && s.startTime === newSlot.startTime && s.endTime === newSlot.endTime
    );
    if (exists) { setFormError('This slot already exists'); return; }

    setSlots([...slots, { ...newSlot, isBooked: false }]);
    setFormError('');
  };

  const removeSlot = (idx) => {
    if (slots[idx].isBooked) { setFormError('Cannot remove a booked slot'); return; }
    setSlots(slots.filter((_, i) => i !== idx));
    setFormError('');
  };

  const handleSave = async () => {
    const unbookedSlots = slots.filter((s) => !s.isBooked);
    if (unbookedSlots.length === 0) {
      setFormError('Add at least one availability slot');
      return;
    }
    setFormError('');
    try {
      await dispatch(updateAvailability(unbookedSlots.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
      })))).unwrap();
      setSuccess('Availability saved!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setFormError(err || 'Failed to save');
    }
  };

  // Group slots by day for display
  const slotsByDay = {};
  DAYS.forEach((d) => { slotsByDay[d] = slots.filter((s) => s.dayOfWeek === d); });

  return (
    <div className="page-container max-w-4xl">
      <div className="page-header">
        <h1 className="page-title">Manage <span className="gradient-text">Availability</span></h1>
        <p className="page-subtitle">Set your weekly available time slots for students to book</p>
      </div>

      {success && <div className="p-4 rounded-xl bg-success-500/10 border border-success-500/20 text-success-500 text-sm mb-6 animate-slide-down">✓ {success}</div>}
      {formError && <div className="p-4 rounded-xl bg-danger-500/10 border border-danger-500/20 text-danger-500 text-sm mb-6 animate-slide-down">{formError}</div>}

      {/* Add Slot */}
      <div className="card-flat mb-6">
        <h2 className="text-lg font-display font-semibold text-surface-100 mb-4">Add Time Slot</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="form-group">
            <label className="form-label">Day</label>
            <select className="form-input" value={newSlot.dayOfWeek} onChange={(e) => setNewSlot({ ...newSlot, dayOfWeek: e.target.value })}>
              {DAYS.map((d) => <option key={d} value={d}>{capitalize(d)}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Start Time</label>
            <select className="form-input" value={newSlot.startTime} onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}>
              {TIME_SLOTS.map((t) => <option key={t} value={t}>{formatTime(t)}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">End Time</label>
            <select className="form-input" value={newSlot.endTime} onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}>
              {TIME_SLOTS.map((t) => <option key={t} value={t}>{formatTime(t)}</option>)}
            </select>
          </div>
          <div className="form-group justify-end">
            <button type="button" onClick={addSlot} className="btn btn-primary">+ Add Slot</button>
          </div>
        </div>
      </div>

      {/* Weekly View */}
      <div className="card-flat mb-8">
        <h2 className="text-lg font-display font-semibold text-surface-100 mb-4">Your Weekly Schedule</h2>
        {slots.length === 0 ? (
          <p className="text-sm text-surface-500 py-4">No availability set. Add your first slot above.</p>
        ) : (
          <div className="space-y-4">
            {DAYS.map((day) => {
              const daySlots = slotsByDay[day];
              if (daySlots.length === 0) return null;
              return (
                <div key={day} className="p-4 rounded-xl bg-surface-900 border border-surface-700">
                  <h3 className="text-sm font-semibold text-surface-300 mb-3">{capitalize(day)}</h3>
                  <div className="flex flex-wrap gap-2">
                    {daySlots.map((s, idx) => {
                      const globalIdx = slots.findIndex(
                        (sl) => sl.dayOfWeek === s.dayOfWeek && sl.startTime === s.startTime && sl.endTime === s.endTime
                      );
                      return (
                        <div key={idx} className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${
                          s.isBooked
                            ? 'bg-danger-500/10 text-danger-400 border border-danger-500/20'
                            : 'bg-primary-500/10 text-primary-300 border border-primary-500/20'
                        }`}>
                          <span>{formatTime(s.startTime)} – {formatTime(s.endTime)}</span>
                          {s.isBooked ? (
                            <span className="text-[10px] opacity-60">BOOKED</span>
                          ) : (
                            <button onClick={() => removeSlot(globalIdx)} className="text-surface-500 hover:text-danger-400 transition-colors">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <button onClick={handleSave} disabled={loading} className="btn btn-primary btn-lg w-full">
        {loading ? 'Saving...' : 'Save Availability'}
      </button>
    </div>
  );
};

export default TutorAvailability;
