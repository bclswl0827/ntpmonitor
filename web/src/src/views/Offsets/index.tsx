import { mdiRefresh } from '@mdi/js';
import Icon from '@mdi/react';
import ReactECharts from 'echarts-for-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useGetObserveNtpServerListQuery, useGetServerOffsetsLazyQuery } from '../../graphql';

const Offsets = () => {
    const [currentTime, setCurrentTime] = useState(0);
    const [queryTime, setQueryTime] = useState([0, 0]);
    const [serverList, setServerList] = useState<
        Record<
            string,
            {
                name: string;
                address: string;
                remark: string;
                createdAt: number;
                updatedAt: number;
            }
        >
    >({});

    const {
        data: getObserveNtpServerListData,
        loading: getObserveNtpServerListLoading,
        error: getObserveNtpServerListError,
        refetch: getObserveNtpServerRefetch
    } = useGetObserveNtpServerListQuery({ pollInterval: 60 * 1000 });

    useEffect(() => {
        if (
            !getObserveNtpServerListLoading &&
            !getObserveNtpServerListError &&
            getObserveNtpServerListData
        ) {
            setCurrentTime(getObserveNtpServerListData.getCurrentTime.timestamp);
            setQueryTime([
                getObserveNtpServerListData.getCurrentTime.timestamp - 24 * 60 * 60 * 1000,
                getObserveNtpServerListData.getCurrentTime.timestamp
            ]);
            setServerList(
                getObserveNtpServerListData.getObserveNTPServerList.reduce(
                    (acc, { name, address, remark, createdAt, updatedAt, uuid }) => ({
                        ...acc,
                        [uuid]: { name, address, remark, createdAt, updatedAt }
                    }),
                    {}
                )
            );
        }
    }, [getObserveNtpServerListData, getObserveNtpServerListError, getObserveNtpServerListLoading]);

    const chartRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const [getServerOffsets, { loading: getServerOffsetsLoading }] = useGetServerOffsetsLazyQuery();
    const [serverOffsetData, setServerOffsetData] = useState<
        Record<
            string,
            {
                timestamp: number;
                reference: string;
                offset: number;
                roundTrip: number;
                rootDelay: number;
                rootDispersion: number;
                rootDistance: number;
                stratum: number;
                serverRefId: string;
                name: string;
                address: string;
            }[]
        >
    >({});

    const [selectedServers, setSelectedServers] = useState<Array<string>>([]);
    const queryServerOffsets = useCallback(
        async (start: number, end: number, uuid: string) => {
            const { data } = await getServerOffsets({ variables: { uuid, start, end } });
            if (data) {
                setServerOffsetData((prev) => ({
                    ...prev,
                    [uuid]: data.getServerOffsets.map((s) => ({
                        ...s,
                        name: serverList[uuid].name,
                        address: serverList[uuid].address
                    }))
                }));
            }
        },
        [getServerOffsets, serverList]
    );
    const queryAllServerOffsets = useCallback(
        async (start: number, end: number) => {
            for (const uuid of selectedServers) {
                await queryServerOffsets(start, end, uuid);
            }
        },
        [queryServerOffsets, selectedServers]
    );

    const queryOptions = useMemo(
        () => [
            { label: '10 min', ms: 10 * 60 * 1000 },
            { label: '30 min', ms: 30 * 60 * 1000 },
            { label: '60 min', ms: 60 * 60 * 1000 },
            { label: '6 hours', ms: 6 * 60 * 60 * 1000 },
            { label: '12 hours', ms: 12 * 60 * 60 * 1000 },
            { label: '24 hours', ms: 24 * 60 * 60 * 1000 }
        ],
        []
    );
    const dateInputRef = useRef<HTMLInputElement>(null);
    const handleQueryByDate = useCallback(async () => {
        const startTime = new Date(dateInputRef.current?.value ?? 0).getTime();
        const endTime = startTime + 24 * 60 * 60 * 1000;
        if (!startTime) {
            dateInputRef.current?.focus();
            return;
        }
        setQueryTime([startTime, endTime]);
        queryAllServerOffsets(startTime, endTime);
    }, [queryAllServerOffsets]);

    const getDisplayDateTime = (timestamp: number) => {
        if (!timestamp) {
            return '';
        }

        return new Intl.DateTimeFormat('en-US', {
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).format(new Date(timestamp));
    };

    const makeOption = useCallback(
        (uuid: string) => {
            const server = serverOffsetData[uuid];
            if (!server) {
                return {};
            }

            const baseTooltip = (p: { data: (typeof serverOffsetData)[string] }) => {
                const rec = p.data[2];
                const date = new Date(rec.timestamp).toLocaleString('en-US');

                return `<div style="font-size:13px;">
            <b>${date}</b>
            <br/><br/>

            <b>Name:</b> ${rec.name}<br/>
            <b>Address:</b> ${rec.address}<br/>
            <b>Time Offset:</b> ${rec.offset} ms<br/>
            <b>Round Trip:</b> ${rec.roundTrip} ms<br/>
            <b>Root Delay:</b> ${rec.rootDelay} ms<br/>
            <b>Root Dispersion:</b> ${rec.rootDispersion} ms<br/>
            <b>Root Distance:</b> ${rec.rootDistance} ms<br/>
            <b>Stratum:</b> ${rec.stratum}<br/>
            <b>Server Reference ID:</b> ${rec.serverRefId}<br/>
            <b>Reference Server:</b> ${rec.reference}<br/>
        </div>`;
            };

            const dateTimeFormatter = (value: number) => {
                const d = new Date(value);
                const h = d.getHours().toString().padStart(2, '0');
                const m = d.getMinutes().toString().padStart(2, '0');
                return `${h}:${m}`;
            };

            const option = {
                tooltip: { trigger: 'item', formatter: baseTooltip },
                yAxis: { type: 'value', name: 'Drift (ppm)' },
                dataZoom: [{ type: 'inside', throttle: 50 }],
                series: [
                    {
                        type: 'scatter',
                        symbolSize: 8,
                        data: server.map((d) => [d.timestamp, d.offset, d])
                    }
                ],
                xAxis: {
                    type: 'time',
                    axisLabel: {
                        formatter: dateTimeFormatter,
                        hideOverlap: true,
                        interval: 'auto',
                        rotate: 0
                    }
                }
            };

            return option;
        },
        [serverOffsetData]
    );

    return getObserveNtpServerListData?.getObserveNTPServerList !== undefined ? (
        <div className="ml-4 flex flex-col space-y-4 md:mt-6">
            <div className="flex flex-col space-y-2">
                <h2 className="mb-2 text-4xl font-extrabold text-gray-800">
                    Server Offsets Visualization
                </h2>

                {queryTime[0] !== 0 && queryTime[1] !== 0 && (
                    <span className="font-mono text-gray-700">
                        Displaying data from
                        <b> {getDisplayDateTime(queryTime[0])} </b>
                        to
                        <b> {getDisplayDateTime(queryTime[1])}</b>.
                    </span>
                )}

                {queryTime[0] !== 0 && queryTime[1] !== 0 && (
                    <div className="flex flex-wrap gap-2">
                        <button className="btn btn-sm" onClick={() => getObserveNtpServerRefetch()}>
                            <Icon path={mdiRefresh} size={0.85} className="opacity-80" />
                            <span>Refresh</span>
                        </button>

                        {queryOptions.map(({ label, ms }) => (
                            <button
                                key={label}
                                className="btn btn-sm"
                                onClick={() => {
                                    setQueryTime([currentTime - ms, currentTime]);
                                    queryAllServerOffsets(currentTime - ms, currentTime);
                                }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                )}

                {queryTime[0] !== 0 && queryTime[1] !== 0 && (
                    <div className="flex items-center space-x-2">
                        <input
                            required
                            ref={dateInputRef}
                            type="date"
                            className="input input-sm font-mono text-sm outline-0"
                        />
                        <button onClick={handleQueryByDate} className="btn btn-sm">
                            Search
                        </button>
                    </div>
                )}
            </div>

            <div className="flex flex-col space-x-4 md:flex-row">
                <div className="flex flex-1 flex-col space-y-4 p-2 md:w-1/2">
                    <div className="card card-border bg-base-100 w-full rounded-md shadow-md">
                        <div className="card-body">
                            <h2 className="card-title">Select Servers</h2>
                            <div className="mt-4 max-h-screen overflow-scroll">
                                {Object.entries(serverList)
                                    .sort((a, b) => a[1].createdAt - b[1].createdAt)
                                    .map(([uuid, s]) => (
                                        <label
                                            key={uuid}
                                            className="flex min-w-xs cursor-pointer items-center space-x-6 rounded p-2 hover:bg-gray-100"
                                        >
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-sm mt-1"
                                                checked={selectedServers.includes(uuid)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedServers((prev) => [
                                                            ...prev,
                                                            uuid
                                                        ]);
                                                        queryServerOffsets(
                                                            queryTime[0],
                                                            queryTime[1],
                                                            uuid
                                                        );
                                                    } else {
                                                        setSelectedServers((prev) =>
                                                            prev.filter((id) => id !== uuid)
                                                        );
                                                    }
                                                }}
                                            />

                                            <div className="flex w-full flex-col text-sm leading-tight text-gray-700">
                                                <span className="font-medium">{s.name}</span>
                                                <span className="text-gray-500">{s.remark}</span>
                                                <span className="text-gray-600">{s.address}</span>
                                            </div>

                                            {selectedServers.includes(uuid) && (
                                                <button
                                                    className="btn btn-xs justify-center text-center"
                                                    onClick={() => {
                                                        const el = chartRefs.current[uuid];
                                                        if (el) {
                                                            el.scrollIntoView({
                                                                behavior: 'smooth',
                                                                block: 'start'
                                                            });
                                                        }
                                                    }}
                                                >
                                                    Go
                                                </button>
                                            )}
                                        </label>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="animate-fade-down animate-delay-500 p-2 md:w-2/3">
                    <div className="h-full overflow-y-auto rounded-lg">
                        <div className="flex flex-col space-y-4">
                            {selectedServers.map((uuid) => (
                                <div
                                    key={uuid}
                                    className="flex h-[500px] w-full flex-col items-center justify-center rounded-md border-2 border-gray-100 p-2"
                                    ref={(el) => {
                                        chartRefs.current[uuid] = el;
                                    }}
                                >
                                    <h2 className="text-md mt-4 text-center">
                                        <span className="font-bold text-gray-700">
                                            {serverList[uuid]?.name}
                                        </span>
                                        <br />
                                        <span className="text-gray-600">
                                            {serverList[uuid]?.address}
                                        </span>
                                    </h2>

                                    {getServerOffsetsLoading ? (
                                        <span className="loading loading-spinner loading-xl m-auto text-gray-500" />
                                    ) : serverOffsetData[uuid]?.length > 0 ? (
                                        <ReactECharts
                                            option={makeOption(uuid)}
                                            style={{ height: '100%', width: '100%' }}
                                        />
                                    ) : (
                                        <span className="m-auto text-sm text-gray-600">
                                            No data
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className="flex h-full w-full justify-center">
            {getObserveNtpServerListLoading ? (
                <span className="loading loading-spinner loading-xl m-auto text-gray-500" />
            ) : (
                <span className="my-auto text-xl font-bold text-gray-700">
                    Please add some obervation NTP servers first.
                </span>
            )}
        </div>
    );
};

export default Offsets;
