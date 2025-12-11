import { mdiRefresh } from '@mdi/js';
import Icon from '@mdi/react';
import ReactECharts from 'echarts-for-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useGetClockDriftsLazyQuery, useGetCurrentTimeLazyQuery } from '../../graphql';

const Drifts = () => {
    const [clockDriftRecords, setClockDriftRecords] = useState<
        {
            timestamp: number;
            reference: string;
            longTermDrift: number;
            shortTermDrift: number;
        }[]
    >([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [getClockDrifts] = useGetClockDriftsLazyQuery();

    const [queryTime, setQueryTime] = useState([0, 0]);
    const mapClockDriftsToState = useCallback(
        async (start: number, end: number) => {
            const { data } = await getClockDrifts({ variables: { start, end } });
            if (data) {
                setClockDriftRecords(data.getClockDrifts);
                setQueryTime([start, end]);
                setIsLoadingData(false);
            }
        },
        [getClockDrifts]
    );

    const [getCurrentTime] = useGetCurrentTimeLazyQuery();
    const queryClockDrifts = useCallback(
        async (duration = 60 * 60 * 1000) => {
            try {
                const { data } = await getCurrentTime();
                if (data) {
                    const endTime = data.getCurrentTime.timestamp;
                    const startTime = endTime - duration;
                    await mapClockDriftsToState(startTime, endTime);
                }
            } catch {
                /* empty */
            }
        },
        [getCurrentTime, mapClockDriftsToState]
    );

    useEffect(() => {
        queryClockDrifts();
    }, [queryClockDrifts]);

    const queryOptions = useMemo(
        () => [
            { label: '10 min', ms: 10 * 60 * 1000 },
            { label: '30 min', ms: 30 * 60 * 1000 },
            { label: '60 min', ms: 60 * 60 * 1000 },
            { label: '6 hours', ms: 6 * 60 * 60 * 1000 },
            { label: '12 hours', ms: 12 * 60 * 60 * 1000 },
            { label: '24 hours', ms: 24 * 60 * 60 * 1000 },
            { label: '48 hours', ms: 48 * 60 * 60 * 1000 },
            { label: '72 hours', ms: 72 * 60 * 60 * 1000 }
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
        setIsLoadingData(true);
        await mapClockDriftsToState(startTime, endTime);
        setIsLoadingData(false);
    }, [mapClockDriftsToState]);

    const { longOption, shortOption } = useMemo(() => {
        if (!clockDriftRecords.length) {
            return { longOption: {}, shortOption: {} };
        }

        const ptsShort = clockDriftRecords.map((d) => [d.timestamp, d.shortTermDrift, d]);
        const ptsLong = clockDriftRecords.map((d) => [d.timestamp, d.longTermDrift, d]);

        const baseTooltip = (p: { data: typeof clockDriftRecords }) => {
            const rec = p.data[2];
            const date = new Date(rec.timestamp).toLocaleString('en-US');
            return `<div style="font-size:13px;">
            <b>${date}</b>
            <br/><br/>

            <b>Reference Server:</b> ${rec.reference}<br/>
            <b>Short-term Drift:</b> ${rec.shortTermDrift.toFixed(3)} ppm<br/>
            <b>Long-term Drift:</b> ${rec.longTermDrift.toFixed(3)} ppm<br/>
        </div>`;
        };

        const dateTimeFormatter = (value: number) => {
            const d = new Date(value);
            const h = d.getHours().toString().padStart(2, '0');
            const m = d.getMinutes().toString().padStart(2, '0');
            return `${h}:${m}`;
        };

        const shortOption = {
            tooltip: { trigger: 'item', formatter: baseTooltip },
            yAxis: { type: 'value', name: 'Drift (ppm)' },
            dataZoom: [{ type: 'inside', throttle: 50 }],
            series: [{ type: 'scatter', symbolSize: 8, data: ptsShort }],
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

        const longOption = {
            tooltip: { trigger: 'item', formatter: baseTooltip },
            yAxis: { type: 'value', name: 'Drift (ppm)' },
            dataZoom: [{ type: 'inside', throttle: 50 }],
            series: [{ type: 'scatter', symbolSize: 8, data: ptsLong }],
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

        return { longOption, shortOption };
    }, [clockDriftRecords]);

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

    return (
        <div className="mx-4 flex flex-col space-y-4 md:mt-6">
            <div className="flex flex-col space-y-2">
                <h2 className="mb-2 text-4xl font-extrabold text-gray-800">
                    Clock Drifts Visualization
                </h2>

                {queryTime[0] !== 0 && queryTime[1] !== 0 && (
                    <span className="font-mono text-gray-700">
                        Displaying data from
                        <b> {getDisplayDateTime(queryTime[0])} </b>
                        to
                        <b> {getDisplayDateTime(queryTime[1])}</b>.
                    </span>
                )}

                <div className="flex flex-wrap gap-2">
                    <button
                        className="btn btn-sm"
                        onClick={() => {
                            queryClockDrifts();
                            setIsLoadingData(true);
                        }}
                    >
                        <Icon path={mdiRefresh} size={0.85} className="opacity-80" />
                        <span>Refresh</span>
                    </button>

                    {queryOptions.map(({ label, ms }) => (
                        <button
                            key={label}
                            className="btn btn-sm"
                            onClick={() => {
                                queryClockDrifts(ms);
                                setIsLoadingData(true);
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </div>

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
            </div>

            <div className="flex h-[500px] w-full flex-col">
                <div className="mt-6">
                    <h3 className="text-xl font-bold text-gray-800">Long-term Clock Drift</h3>
                    <p className="mt-1 text-sm text-gray-600">
                        Long-term drift shows the clock frequency deviation averaged over a longer
                        window. It reflects the hardware oscillator’s baseline stability and
                        long-range behavior.
                    </p>
                </div>

                {!isLoadingData ? (
                    clockDriftRecords.length ? (
                        <ReactECharts
                            option={longOption}
                            style={{ width: '100%', height: '100%' }}
                        />
                    ) : (
                        <span className="m-auto text-gray-500">Nothing to show.</span>
                    )
                ) : (
                    <span className="loading loading-spinner loading-xl m-auto text-gray-500" />
                )}
            </div>

            <div className="flex h-[500px] w-full flex-col rounded-md">
                <div className="mt-6">
                    <h3 className="text-xl font-bold text-gray-800">Short-term Clock Drift</h3>
                    <p className="mt-1 text-sm text-gray-600">
                        Short-term drift captures rapid frequency fluctuations over a short window.
                        It represents short-timescale jitter or temperature-related variations.
                    </p>
                </div>

                {!isLoadingData ? (
                    clockDriftRecords.length ? (
                        <ReactECharts
                            option={shortOption}
                            style={{ width: '100%', height: '100%' }}
                        />
                    ) : (
                        <span className="m-auto text-gray-500">Nothing to show.</span>
                    )
                ) : (
                    <span className="loading loading-spinner loading-xl m-auto text-gray-500" />
                )}
            </div>
        </div>
    );
};

export default Drifts;
