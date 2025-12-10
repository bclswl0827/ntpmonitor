import { mdiRefresh } from '@mdi/js';
import Icon from '@mdi/react';
import { getTimeZones } from '@vvo/tzdb';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useGetCurrentTimeLazyQuery } from '../../graphql';
import { useUrlParams } from '../../helpers/request/useUrlParams';

const Home = () => {
    const [fullScreen, setFullScreen] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [getCurrentTime] = useGetCurrentTimeLazyQuery();

    const [referenceServer, setReferenceServer] = useState('');
    const [syncedAt, setSyncedAt] = useState({ local: 0, upstream: 0 });
    const [timeSynced, setTimeSynced] = useState(false);
    const [syncedLocalTimestamp, setSyncedLocalTimestamp] = useState(0);

    const [latency, setLatency] = useState(0);
    const [errorRange, setErrorRange] = useState(0);
    const [isAccurate, setIsAccurate] = useState(false);
    const [timeDiff, setTimeDiff] = useState({ wall: 0, monotonic: 0 });

    const { timezone: urlTimezone } = useUrlParams<{ timezone?: string }>(searchParams);
    const [localTimezone, setLocalTimezone] = useState(
        urlTimezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone
    );
    const [currentLocale] = useState('en-US');
    const [timezoneList] = useState(
        getTimeZones().sort((a, b) => a.rawOffsetInMinutes - b.rawOffsetInMinutes)
    );

    const syncTime = useCallback(async () => {
        const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
        const getSample = async () => {
            const monoT0 = performance.now();
            const t0 = Date.now();
            const res = await getCurrentTime();
            const monoT1 = performance.now();
            const t1 = Date.now();

            if (res.error || !res.data) {
                return null;
            }

            const { timestamp, syncedAt, reference } = res.data.getCurrentTime;
            const rtt = monoT1 - monoT0;
            const wallDiff = (t0 + t1) / 2 - timestamp;
            const monoDiff = (monoT0 + monoT1) / 2 - timestamp;

            return { rtt, wallDiff, monoDiff, syncedAt, reference };
        };

        await sleep(500);
        const s1 = await getSample();
        if (!s1) {
            return;
        }

        await sleep(500);
        const s2 = await getSample();
        if (!s2) {
            return;
        }

        await sleep(500);
        const s3 = await getSample();
        if (!s3) {
            return;
        }

        await sleep(500);
        const s4 = await getSample();
        if (!s4) {
            return;
        }

        const best = [s1, s2, s3, s4].reduce((a, b) => (a.rtt < b.rtt ? a : b));

        setReferenceServer(best.reference);
        setSyncedAt({ local: performance.now() - best.monoDiff, upstream: best.syncedAt });

        setTimeSynced(true);
        setLatency(best.rtt);
        setErrorRange(best.rtt / 2);
        setIsAccurate(Math.abs(best.wallDiff) < 200);
        setTimeDiff({ wall: best.wallDiff, monotonic: best.monoDiff });
    }, [getCurrentTime]);

    useEffect(() => {
        requestAnimationFrame(() => syncTime());
    }, [syncTime]);

    useEffect(() => {
        if (timeSynced) {
            const timer = setInterval(() => {
                setSyncedLocalTimestamp(performance.now() - timeDiff.monotonic);
            }, 0);
            return () => clearInterval(timer);
        }
    }, [timeDiff.monotonic, timeSynced]);

    const [syncDetails, setSyncDetails] = useState({ heading: '', content: '' });
    const getSyncDetails = useCallback(() => {
        if (!timeSynced) {
            return { heading: 'Synchronizing...', content: '' };
        }

        const hostname = window.location.hostname;
        if (isAccurate) {
            return {
                heading: 'Your time is exact!',
                content: `The difference from ${hostname} was ${timeDiff.wall >= 0 ? '+' : ''}${(timeDiff.wall / 1000).toFixed(3)} seconds (±${(errorRange / 1000).toFixed(3)} seconds). `
            };
        }

        const content = `Accuracy of synchronization was ±${(errorRange / 1000).toFixed(3)} seconds.`;
        if (timeDiff.wall > 0) {
            return {
                content,
                heading: `Your clock is ${Math.abs(timeDiff.wall / 1000).toFixed(3)} seconds ahead.`
            };
        }
        return {
            content,
            heading: `Your clock is ${Math.abs(timeDiff.wall / 1000).toFixed(3)} seconds behind.`
        };
    }, [errorRange, isAccurate, timeDiff.wall, timeSynced]);

    useEffect(() => {
        setSyncDetails(getSyncDetails());
    }, [getSyncDetails]);

    const getCountryByTimezone = useCallback((timezone: string) => {
        const entry = getTimeZones().find((z) => z.name === timezone);
        if (!entry) {
            return [];
        }
        return entry.countryName;
    }, []);

    const getDisplayTime = useCallback((timestamp: number, locale: string, timezone: string) => {
        if (!timestamp) {
            return '--:--:--';
        }

        const parts = new Intl.DateTimeFormat(locale, {
            timeZone: timezone,
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).formatToParts(new Date(timestamp));

        const get = (type: string) => parts.find((p) => p.type === type)?.value;
        return `${get('hour')}:${get('minute')}:${get('second')}`;
    }, []);

    const getDisplayDate = useCallback((timestamp: number, locale: string, timezone: string) => {
        if (!timestamp) {
            return '';
        }

        return new Intl.DateTimeFormat(locale, {
            timeZone: timezone,
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(timestamp));
    }, []);

    const getDisplayDateTime = useCallback(
        (timestamp: number, locale: string, timezone: string) => {
            if (!timestamp) {
                return '';
            }

            return new Intl.DateTimeFormat(locale, {
                timeZone: timezone,
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            }).format(new Date(timestamp));
        },
        []
    );

    return (
        <>
            <div className="ml-4 flex flex-col space-y-2 md:mt-6">
                <div className="mb-2 flex flex-col space-y-2 space-x-4 md:flex-row md:items-center">
                    <h2 className="text-4xl font-extrabold text-gray-800">{syncDetails.heading}</h2>
                    {timeSynced && (
                        <button
                            className="btn btn-sm"
                            onClick={() => {
                                setTimeSynced(false);
                                syncTime();
                            }}
                        >
                            <Icon path={mdiRefresh} size={0.85} className="opacity-80" />
                            <span>Resync</span>
                        </button>
                    )}
                </div>

                <span className="font-mono text-gray-700">{syncDetails.content}</span>

                <select
                    className="select-sm select w-fit max-w-full rounded border border-gray-300 font-mono text-sm outline-0"
                    value={localTimezone}
                    onChange={({ target }) => {
                        setLocalTimezone(target.value);
                        setSearchParams({ timezone: target.value });
                    }}
                >
                    {timezoneList.map((tz) => (
                        <option key={tz.name} value={tz.name}>
                            {`${tz.name} (UTC${tz.rawOffsetInMinutes >= 0 ? '+' : ''}${tz.rawOffsetInMinutes / 60})`}
                        </option>
                    ))}
                </select>

                {timeSynced && (
                    <span className="font-mono text-gray-700">
                        Time in <b>{getCountryByTimezone(localTimezone)}</b> now:
                    </span>
                )}
            </div>

            <div
                onClick={() => setFullScreen(!fullScreen)}
                className={`cursor-pointer text-center font-extrabold tracking-widest text-gray-800 select-none ${
                    fullScreen
                        ? 'fixed inset-0 z-50 flex items-center justify-center bg-white text-[11vw]'
                        : 'mt-16 text-[clamp(2rem,11vw,8rem)]'
                }`}
            >
                {timeSynced
                    ? getDisplayTime(syncedLocalTimestamp, currentLocale, localTimezone)
                    : '--:--:--'}
            </div>

            {timeSynced && (
                <div className="mx-8 mt-16 flex flex-col items-end space-y-2 font-mono lg:mt-8">
                    <div className="text-[clamp(1.3rem,2vw,4rem)] font-light text-gray-700">
                        {getDisplayDate(syncedLocalTimestamp, currentLocale, localTimezone)}
                    </div>
                    <div className="text-md flex flex-col items-start text-gray-600">
                        <div className="grid grid-cols-[auto_1fr] gap-x-2 font-mono text-sm">
                            <span className="text-right font-medium">Local System Time:</span>
                            <span>
                                {getDisplayDateTime(Date.now(), currentLocale, localTimezone)}
                            </span>
                            <span className="text-right font-medium">Last Synced At:</span>
                            <span>
                                {getDisplayDateTime(syncedAt.local, currentLocale, localTimezone)}
                            </span>
                            <span className="mb-2 text-right font-medium">Local Timezone:</span>
                            <span>{localTimezone}</span>

                            <span className="text-right font-medium">Round-trip Delay:</span>
                            <span>{latency} ms</span>
                            <span className="text-right font-medium">Error Range:</span>
                            <span>±{errorRange} ms</span>
                            <span className="text-right font-medium">Local Wall Time Offset:</span>
                            <span>{timeDiff.wall} ms</span>
                            <span className="mb-2 text-right font-medium">
                                Local Monotonic Time Offset:
                            </span>
                            <span>{timeDiff.monotonic} ms</span>

                            <span className="text-right font-medium">Upstream Synced At:</span>
                            <span>
                                {getDisplayDateTime(
                                    syncedAt.upstream,
                                    currentLocale,
                                    localTimezone
                                )}
                            </span>
                            <span className="text-right font-medium">Upstream NTP Server:</span>
                            <span>{referenceServer}</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Home;
