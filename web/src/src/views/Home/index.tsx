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
    const [localTimestamp, setLocalTimestamp] = useState(0);

    const [latency, setLatency] = useState(0);
    const [timeDiff, setTimeDiff] = useState(0);
    const [errorRange, setErrorRange] = useState(0);
    const [isAccurate, setIsAccurate] = useState(false);

    const { timezone: urlTimezone } = useUrlParams<{ timezone?: string }>(searchParams);
    const [localTimezone, setLocalTimezone] = useState(
        urlTimezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone
    );
    const [currentLocale] = useState(Intl.DateTimeFormat().resolvedOptions().locale);
    const [timezoneList] = useState(
        getTimeZones().sort((a, b) => a.rawOffsetInMinutes - b.rawOffsetInMinutes)
    );

    const syncTime = useCallback(async () => {
        const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
        const getSample = async () => {
            const t0 = Date.now();
            const res = await getCurrentTime();
            const t1 = Date.now();

            if (res.error || !res.data) {
                return null;
            }

            const { timestamp, syncedAt, reference } = res.data.getCurrentTime;
            const rtt = t1 - t0;
            const diff = t0 - timestamp - rtt / 2;

            return { timestamp, rtt, diff, syncedAt, reference };
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

        setReferenceServer(s1.reference);
        setSyncedAt({ local: s1.timestamp, upstream: s1.syncedAt });

        const avgRtt = (s1.rtt + s2.rtt + s3.rtt + s4.rtt) / 4;
        const avgDiff = (s1.diff + s2.diff + s3.diff + s4.diff) / 4;

        setTimeSynced(true);
        setLatency(avgRtt);
        setErrorRange(avgRtt / 4);
        setTimeDiff(avgDiff);
        setIsAccurate(Math.abs(avgDiff) < 200);
    }, [getCurrentTime]);

    useEffect(() => {
        requestAnimationFrame(() => {
            setTimeout(syncTime, 0);
        });
    }, [syncTime]);

    useEffect(() => {
        if (timeSynced) {
            const timer = setInterval(syncTime, 30000);
            return () => clearInterval(timer);
        }
    }, [timeSynced, syncTime]);

    useEffect(() => {
        if (timeSynced) {
            const timer = setInterval(() => {
                setLocalTimestamp(Date.now() - timeDiff);
            }, 100);
            return () => clearInterval(timer);
        }
    }, [timeSynced, timeDiff]);

    const [syncDetails, setSyncDetails] = useState({ heading: '', content: '' });
    const getSyncDetails = useCallback(() => {
        if (!timeSynced) {
            return { heading: 'Synchronizing...', content: '' };
        }

        const hostname = window.location.hostname;
        if (isAccurate) {
            return {
                heading: 'Your time is exact!',
                content: `The difference from ${hostname} was ${(timeDiff / 1000).toFixed(3)} seconds (±${(errorRange / 1000).toFixed(3)} seconds). `
            };
        }

        const content = `Accuracy of synchronization was ±${(errorRange / 1000).toFixed(3)} seconds.`;
        if (timeDiff > 0) {
            return {
                content,
                heading: `Your clock is ${Math.abs(timeDiff / 1000).toFixed(3)} seconds ahead.`
            };
        }
        return {
            content,
            heading: `Your clock is ${Math.abs(timeDiff / 1000).toFixed(3)} seconds behind.`
        };
    }, [errorRange, isAccurate, timeDiff, timeSynced]);

    useEffect(() => {
        setSyncDetails(getSyncDetails());
    }, [timeSynced, isAccurate, timeDiff, getSyncDetails]);

    const getCountryByTimezone = (timezone: string) => {
        const entry = getTimeZones().find((z) => z.name === timezone);
        if (!entry) {
            return [];
        }
        return entry.countryName;
    };
    const getDisplayTime = (timestamp: number, locale: string, timezone: string) => {
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
    };

    const getDisplayDate = (timestamp: number, locale: string, timezone: string) => {
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
    };

    const getDisplayDateTime = (timestamp: number, locale: string, timezone: string) => {
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
    };

    return (
        <div className="w-full">
            <div className="ml-4 flex flex-col space-y-2 md:mt-6">
                <h2 className="mb-4 text-4xl font-extrabold text-gray-800">
                    {syncDetails.heading}
                </h2>
                <span className="font-mono text-gray-700">{syncDetails.content}</span>

                <select
                    className="w-fit rounded border border-gray-300 p-2 font-mono text-sm"
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
                    ? getDisplayTime(localTimestamp, currentLocale, localTimezone)
                    : '--:--:--'}
            </div>

            {timeSynced && (
                <div className="mx-8 mt-16 flex flex-col items-end space-y-2 font-mono lg:mt-8">
                    <div className="text-[clamp(1.3rem,2vw,4rem)] font-light text-gray-700">
                        {getDisplayDate(localTimestamp, currentLocale, localTimezone)}
                    </div>
                    <div className="text-md flex flex-col items-start text-gray-600">
                        <div className="grid grid-cols-[auto_1fr] gap-x-2 font-mono text-sm">
                            <span className="text-right">Local System Time:</span>
                            <span className="font-medium">
                                {getDisplayDateTime(Date.now(), currentLocale, localTimezone)}
                            </span>
                            <span className="text-right">Last Synced At:</span>
                            <span className="font-medium">
                                {getDisplayDateTime(syncedAt.local, currentLocale, localTimezone)}
                            </span>
                            <span className="mb-2 text-right">Local Timezone:</span>
                            <span className="font-medium">{localTimezone}</span>

                            <span className="text-right">Round-trip Delay:</span>
                            <span className="font-medium">{latency.toFixed(3)} ms</span>
                            <span className="text-right">Local Time Offset:</span>
                            <span className="font-medium">{timeDiff.toFixed(3)} ms</span>
                            <span className="mb-2 text-right">Error Range:</span>
                            <span className="font-medium">±{errorRange.toFixed(3)} ms</span>

                            <span className="text-right">Upstream Synced At:</span>
                            <span className="font-medium">
                                {getDisplayDateTime(
                                    syncedAt.upstream,
                                    currentLocale,
                                    localTimezone
                                )}
                            </span>
                            <span className="text-right">Upstream NTP Server:</span>
                            <span className="font-medium">{referenceServer}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
