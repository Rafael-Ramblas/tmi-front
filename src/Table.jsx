import React, { useEffect, useState, useRef, useCallback } from 'react'
import Axios from 'axios'
import { isEqual } from 'lodash'

const Test = ({ prevViewers, data, counter }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>username</th>
                </tr>
            </thead>
            <tbody>
                {data.map((viewer, i) => (
                    <tr key={i}>
                        <td>{i + 1}</td>
                        <td
                            style={{
                                color: counter.current > 1
                                    ? prevViewers.current.includes(viewer)
                                        ? 'black'
                                        : 'red'
                                    : 'black',
                            }}
                        >
                            {viewer}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

const Component = () => {
    const [data, setData] = useState([])
    const prevViewers = useRef([])
    const counter = useRef(0)

    const handleTest = useCallback(
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
            Axios.get('https://tmi-server.herokuapp.com/').then(handleTest)
        }, 10000)
        return () => clearInterval(id)
    }, [data, handleTest])

    console.warn('update')

    return <Test data={data} prevViewers={prevViewers} counter={counter} />
}

export default Component
