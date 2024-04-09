import React from 'react';
import { FormControl, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

export default function WeekdaySelector({ selectedWeekdays, onChange }){
    const handleWeekdayChange = (weekday, isChecked) => {
        if (isChecked) {
          onChange([...selectedWeekdays, { dia: weekday }])
        } else {
          onChange(selectedWeekdays.filter(item => item.dia !== weekday))
        }
      };
    
      return (
        <FormControl component="fieldset">
          <FormGroup row>
            <FormControlLabel
              control={<Checkbox checked={selectedWeekdays.some(item => item.dia === 'Segunda-feira')} onChange={(e) => handleWeekdayChange('Segunda-feira', e.target.checked)} />}
              label="Segunda-feira"
            />
            <FormControlLabel
              control={<Checkbox checked={selectedWeekdays.some(item => item.dia === 'Terça-feira')} onChange={(e) => handleWeekdayChange('Terça-feira', e.target.checked)} />}
              label="Terça-feira"
            />
            <FormControlLabel
              control={<Checkbox checked={selectedWeekdays.some(item => item.dia === 'Quarta-feira')} onChange={(e) => handleWeekdayChange('Quarta-feira', e.target.checked)} />}
              label="Quarta-feira"
            />
            <FormControlLabel
              control={<Checkbox checked={selectedWeekdays.some(item => item.dia === 'Quinta-feira')} onChange={(e) => handleWeekdayChange('Quinta-feira', e.target.checked)} />}
              label="Quinta-feira"
            />
            <FormControlLabel
              control={<Checkbox checked={selectedWeekdays.some(item => item.dia === 'Sexta-feira')} onChange={(e) => handleWeekdayChange('Sexta-feira', e.target.checked)} />}
              label="Sexta-feira"
            />
            <FormControlLabel
              control={<Checkbox checked={selectedWeekdays.some(item => item.dia === 'Sábado')} onChange={(e) => handleWeekdayChange('Sábado', e.target.checked)} />}
              label="Sábado"
            />
          </FormGroup>
        </FormControl>
      );
    
}