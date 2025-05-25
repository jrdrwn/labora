'use client';

import { Card, CardContent } from '@/components/ui/card';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';

import 'react-big-calendar/lib/css/react-big-calendar.css';

export default function Calendar() {
  return (
    <Card className="w-full max-w-6xl">
      <CardContent>
        <FullCalendar
          height={'auto'}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay listWeek',
          }}
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
          initialView="dayGridMonth"
        />
      </CardContent>
    </Card>
  );
}
