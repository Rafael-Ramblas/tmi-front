import React, { useState, useCallback, useRef, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import Axios from 'axios'
import { isEqual } from 'lodash'

const StyledTableCell = ({ children, color }) => (
    <TableCell style={{ color: color || '#f1f1f1', border: 'hidden' }}>
        {children}
    </TableCell>
)

const Component = () => {
    const [data, setData] = useState([])
    const prevViewers = useRef([])
    const counter = useRef(0)

    const fetchViewers = useCallback(
        (resp) => {
            counter.current++
            if (!isEqual(resp.data.chatters.viewers, data)) {
                prevViewers.current = data
                setData(resp.data.chatters.viewers)
            }
        },
        [setData, data]
    )

    useEffect(() => {
        const id = setInterval(() => {
            Axios.get('https://tmi-server.herokuapp.com/').then(fetchViewers)
        }, 10000)
        return () => clearInterval(id)
    }, [data, fetchViewers])

    const useStyles = makeStyles({
        table: {
            maxWidth: 500,
            backgroundColor: '#262626',
        },
    })

    const classes = useStyles()
    const tableData = data.map((viewer, i) => ({ index: i + 1, viewer }))

    console.warn(counter.current)

    return (
        <Table className={classes.table} aria-label='simple table'>
            <TableHead>
                <TableRow>
                    <StyledTableCell>#</StyledTableCell>
                    <StyledTableCell>Viewer</StyledTableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {tableData.map((row) => (
                    <TableRow key={row.index}>
                        <StyledTableCell component='th' scope='row'>
                            {row.index}
                        </StyledTableCell>
                        <StyledTableCell
                            color={
                                counter.current > 1 &&
                                !prevViewers.current.includes(row.viewer) &&
                                '#6441a5'
                            }
                        >
                            {row.viewer}
                        </StyledTableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default Component
