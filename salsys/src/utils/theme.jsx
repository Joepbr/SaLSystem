import { createTheme } from '@mui/material/styles'
import { indigo, red } from '@mui/material/colors'

const theme = createTheme({
    palette: {
        mode: 'dark', //o padrão é 'light'
        primary: {
            main: indigo[900],
        },
        secondary: {
            main: red[900]
        }
    }
})

export default theme