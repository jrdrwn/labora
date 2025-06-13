'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  CalendarOptions,
  EventChangeArg,
  EventClickArg,
  EventSourceInput,
  OverlapFunc,
} from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';

import 'react-big-calendar/lib/css/react-big-calendar.css';

interface CalendarProps {
  className?: string;
  events?: EventSourceInput;
  eventClick?: ((arg: EventClickArg) => void) | undefined;
  eventChange?: ((arg: EventChangeArg) => void) | undefined;
  eventOverlap?: boolean | OverlapFunc | undefined;
}

export default function Calendar({
  className,
  events,
  eventClick,
  eventChange,
  eventOverlap,
  ...rest
}: CalendarProps & CalendarOptions) {
  return (
    <Card className={cn('w-full max-w-6xl', className)}>
      <CardContent>
        <FullCalendar
          businessHours={[
            {
              daysOfWeek: [1, 2, 3, 4],
              startTime: '07:00',
              endTime: '17:00',
            },
            {
              daysOfWeek: [5],
              startTime: '07:00',
              endTime: '11:00',
            },
            {
              daysOfWeek: [5],
              startTime: '12:00',
              endTime: '17:00',
            },
          ]}
          dayMaxEventRows={3}
          height={'auto'}
          events={events}
          eventClick={eventClick}
          eventChange={eventChange}
          eventOverlap={eventOverlap}
          navLinks={true}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay listWeek',
          }}
          now={new Date()}
          nowIndicator={true}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            interactionPlugin,
          ]}
          initialView="dayGridMonth"
          {...rest}
        />
      </CardContent>
    </Card>
  );
}
