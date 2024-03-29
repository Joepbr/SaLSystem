import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/locale/pt-br';
import myfetch from '../utils/myfetch';

const localizer = momentLocalizer(moment);

class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      console.error('Error caught by error boundary:', error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        return <h1>Something went wrong.</h1>;
      }
  
      return this.props.children;
    }
  }
  

export default function Disponibilidade() {
    const [disponibilidade, setDisponibilidade] = React.useState({})
    const [selectedSlot, setSelectedSlot] = React.useState(null);

    const handleSelectSlot = ({ start, end }) => {
        const dayOfWeek = moment(start).day();
        setSelectedSlot({ dayOfWeek, start, end });
    };

    const handleSaveDisponibilidade = async () => {
        try {
            if (!selectedSlot) {
                alert('Favor selecionar período de disponibilidade')
                return
            }

            const { dayOfWeek } = selectedSlot
            const novaDisponibilidade = { ...disponibilidade }

            const startTime = moment().hour(8).minute(0)
            const endTime = moment().hour(21).minute(0)
            novaDisponibilidade[dayOfWeek] = { start: startTime, end: endTime }

            await myfetch.put('/professores/disponibilidade', { disponibilidade: novaDisponibilidade });
            setDisponibilidade(novaDisponibilidade)
            setSelectedSlot(null)
            alert('Disponibilidade salva com sucesso');
        } catch (error) {
            console.error(error);
            alert('Erro salvando disponibilidade');
        }
    };

    return (
        <ErrorBoundary>
        <div>
            <h2>Selecionar Horários de Disponibilidade</h2>
            <Calendar
                localizer={localizer}
                defaultView='week'
                views={['week']}
                selectable
                onSelectSlot={handleSelectSlot}
                startAccessor="start"
                endAccessor="end"
                events={[]}
                style={{ height: 500 }}
                min={new Date(2024, 0, 1, 8, 0)}
                max={new Date(2024, 0, 1, 21, 0)}
                formats={{
                    dayFormat: 'dddd'
                }}
                culture="pt-BR"
            />
            <p>{JSON.stringify(selectedSlot)}</p>
            <p>{JSON.stringify(disponibilidade)}</p>
            <button onClick={handleSaveDisponibilidade}>Salvar Disponibilidade</button>
        </div>
        </ErrorBoundary>
    );
}