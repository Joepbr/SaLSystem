import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import myfetch from '../utils/myfetch';
import { Button, Typography, Divider, Box, Card, CardContent, CardActions } from '@mui/material';


export default function Modulos(){

    const { id } = useParams(); // Get the course id from the URL params
    const [curso, setCurso] = useState(null);
    const [modulos, setModulos] = useState([]);
  
    useEffect(() => {
      // Fetch curso details and associated modules when component mounts
      fetchCursoAndModulos();
    }, []);
  
    const fetchCursoAndModulos = async () => {
      try {
        // Fetch course details
        const cursoResponse = await myfetch.get(`/cursos/${id}`);
        setCurso(cursoResponse);
  
        // Fetch associated modules
        const modulosResponse = await myfetch.get(`/modulos/${id}`);
        setModulos(modulosResponse);
      } catch (error) {
        console.error(error);
        // Handle error
      }
    };
  
    return (
      <div>
        {curso && (
          <div>
            <Typography sx={{ fontSize: 30, fontWeight: 'bold' }}>
              Curso: {curso.nome}
            </Typography>
            <Divider />
            <Typography variant="h6" gutterBottom>
              {curso.descricao}
            </Typography>
            <Typography variant="p" gutterBottom>
              {curso.detalhes}
            </Typography>
            <Divider />
            <Box mt={2}>
              {modulos.map((modulo) => (
                <Card key={modulo.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" component="div" gutterBottom>
                      {modulo.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {modulo.description}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </div>
        )}
      </div>
    );
}