import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/dist/locale/pt-br';
import { Container, Button, Box } from '@mui/material'
import myfetch from '../utils/myfetch';
import Waiting from '../ui/Waiting';

const localizer = momentLocalizer(moment);

export default function DisponibForm() {
  const [events, setEvents] = React.useState([]);
  const [newEvent, setNewEvent] = React.useState(null);
  const [waiting, setWaiting] = React.useState(false)

  const handleSelectSlot = ({ start, end }) => {
    const newAvailability ={
      start: new Date(start),
      end: new Date(end),
      title: 'Disponível'
    }
    setNewEvent(newAvailability)
    setEvents((prevEvents) => [...prevEvents, newAvailability])
  };

  const handleRemoveEvent = (eventToRemove) => {
    setEvents(events.filter(event => event !== eventToRemove))
  }

  const handleSaveAvailability = async () => {
    try {
      setWaiting(true)

      const response = await myfetch.post('/disponibilidade', { events })
      console.log('Disponibilidade salva: ', response)
      alert('Disponibilidade salva com sucesso')
      setWaiting(false)
    } catch (error) {
      console.error('Erro salvando disponibilidade: ', error)
      alert('Falha em salvar a disponibilidade')
      setWaiting(false)
    }
  }

  return (
      <Container>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={handleSaveAvailability} 
                disabled={events.length === 0}
              >
                Salvar Disponibilidade
              </Button>
          </Box>
          <Calendar
              localizer={localizer}
              events={events}
              selectable
              defaultView="week"
              views={['week']}
              step={30}
              timeslots={2}
              defaultDate={new Date()}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleRemoveEvent}
              style={{ height: '80vh' }}
          />
          <p>{JSON.stringify(events)}</p>
      </Container>
  );
}