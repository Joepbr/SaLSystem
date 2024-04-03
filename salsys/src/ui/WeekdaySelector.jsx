import React from 'react';
import { FormControl, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

export default function WeekdaySelector({ selectedWeekdays, onChange }){
    const handleChange = (event) => {
        const { name, checked } = event.target;
        const updatedWeekdays = checked
          ? [...selectedWeekdays, name]
          : selectedWeekdays.filter((day) => day !== name);
        onChange(updatedWeekdays);
      };
    
      return (
        <FormControl component="fieldset">
          <FormGroup row>
            <FormControlLabel
              control={<Checkbox checked={selectedWeekdays.includes('Segunda-feira')} onChange={handleChange} name="Segunda-feira" />}
              label="Segunda-feira"
            />
            <FormControlLabel
              control={<Checkbox checked={selectedWeekdays.includes('Terça-feira')} onChange={handleChange} name="Terça-feira" />}
              label="Terça-feira"
            />
            <FormControlLabel
              control={<Checkbox checked={selectedWeekdays.includes('Quarta-feira')} onChange={handleChange} name="Quarta-feira" />}
              label="Quarta-feira"
            />
            <FormControlLabel
              control={<Checkbox checked={selectedWeekdays.includes('Quinta-feira')} onChange={handleChange} name="Quinta-feira" />}
              label="Quinta-feira"
            />
            <FormControlLabel
              control={<Checkbox checked={selectedWeekdays.includes('Sexta-feira')} onChange={handleChange} name="Sexta-feira" />}
              label="Sexta-feira"
            />
            <FormControlLabel
              control={<Checkbox checked={selectedWeekdays.includes('Sábado')} onChange={handleChange} name="Sábado" />}
              label="Sábado"
            />
          </FormGroup>
        </FormControl>
      );
    
}