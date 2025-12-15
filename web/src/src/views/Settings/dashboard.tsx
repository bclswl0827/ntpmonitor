import { mdiRefresh } from '@mdi/js';
import Icon from '@mdi/react';
import { useEffect, useMemo, useState } from 'react';

import {
    useAddObserveNtpServerMutation,
    useGetObserveNtpServerListQuery,
    useGetSettingsDataQuery,
    usePurgeClockDriftsMutation,
    usePurgeNtpOffsetsMutation,
    useRemoveObserveNtpServerMutation,
    useSetFailureRetriesMutation,
    useSetPollingIntervalMutation,
    useSetPollingTimeoutMutation,
    useSetPpmWindowMutation,
    useSetReferenceNtpServerMutation,
    useSetRetentionDaysMutation,
    useUpdateObserveNtpServerMutation
} from '../../graphql';

interface IDashboard {
    readonly password: string;
}

interface ISettings {
    readonly failureRetries: number;
    readonly pollingInterval: number;
    readonly pollingTimeout: number;
    readonly ppmWindow: number;
    readonly referenceServer: string;
    readonly retentionDays: number;
}

interface INtpServer {
    readonly uuid: string;
    readonly name: string;
    readonly address: string;
    readonly remark: string;
    readonly createdAt: number;
    readonly updatedAt: number;
}

export const Dashboard = ({ password }: IDashboard) => {
    const [purgeNtpOffsets] = usePurgeNtpOffsetsMutation();
    const handlePurgeOffsetRecords = async () => {
        confirm('Are you sure to purge all offset records?');
        try {
            await purgeNtpOffsets({ variables: { password, before: 0 } });
        } catch {
            /* empty */
        }
    };

    const [purgeClockDriftRecords] = usePurgeClockDriftsMutation();
    const handlePurgeDriftRecords = async () => {
        confirm('Are you sure to purge all drift records?');
        try {
            await purgeClockDriftRecords({ variables: { password, before: 0 } });
        } catch {
            /* empty */
        }
    };

    const [settingsApplyingState, setSettingsApplyingState] = useState({
        failureRetries: false,
        pollingInterval: false,
        pollingTimeout: false,
        ppmWindow: false,
        referenceServer: false,
        retentionDays: false
    });
    const [currentSettings, setCurrentSettings] = useState<ISettings>({
        failureRetries: 0,
        pollingInterval: 0,
        pollingTimeout: 0,
        ppmWindow: 0,
        referenceServer: '',
        retentionDays: 0
    });
    const [
        [setFailureRetriesMutation],
        [setPollingIntervalMutation],
        [setPollingTimeoutMutation],
        [setPpmWindowMutation],
        [setReferenceNtpServerMutation],
        [setRetentionDaysMutation]
    ] = [
        useSetFailureRetriesMutation(),
        useSetPollingIntervalMutation(),
        useSetPollingTimeoutMutation(),
        useSetPpmWindowMutation(),
        useSetReferenceNtpServerMutation(),
        useSetRetentionDaysMutation()
    ];
    const settingsFields = useMemo(
        () => [
            {
                id: 'failureRetries',
                type: 'number',
                title: 'Failure Retries',
                description:
                    'The program issues multiple concurrent requests to the reference server. If a request fails, it will retry up to the limit defined by Failure Retries. A value of 0 disables retry attempts.',
                onSubmit: async () =>
                    await setFailureRetriesMutation({
                        variables: { password, retries: currentSettings.failureRetries }
                    })
            },
            {
                id: 'pollingInterval',
                type: 'number',
                title: 'Polling Interval',
                description:
                    'Polling Interval defines the query frequency (1 - 86,400 seconds). After each query, the program measures time and frequency offsets. Some servers may block frequent requests, so adjust as needed.',
                onSubmit: async () =>
                    await setPollingIntervalMutation({
                        variables: { password, interval: currentSettings.pollingInterval }
                    })
            },
            {
                id: 'pollingTimeout',
                type: 'number',
                title: 'Polling Timeout',
                description:
                    'Polling Timeout sets the query timeout (1 - 300 seconds). If a query exceeds this timeout and overlaps the next interval, that cycle is skipped.',
                onSubmit: async () =>
                    await setPollingTimeoutMutation({
                        variables: { password, timeout: currentSettings.pollingTimeout }
                    })
            },
            {
                id: 'ppmWindow',
                type: 'number',
                title: 'PPM Measurement Window',
                description:
                    'PPM Window sets the time range for long-term drift calculation. Larger windows smooth results; smaller windows respond faster.',
                onSubmit: async () =>
                    await setPpmWindowMutation({
                        variables: { password, window: currentSettings.ppmWindow }
                    })
            },
            {
                id: 'referenceServer',
                type: 'text',
                title: 'Reference NTP Server',
                description:
                    'Reference NTP Server specifies the authoritative time source used for comparison. It should have low RTT and a low Stratum, and its address must differ from all observation servers.',
                onSubmit: async () =>
                    await setReferenceNtpServerMutation({
                        variables: { password, server: currentSettings.referenceServer }
                    })
            },
            {
                id: 'retentionDays',
                type: 'number',
                title: 'Data Retention Days',
                description:
                    'Data Retention Days sets how long offset and drift data are kept. Data older than this are deleted. 0 disables the feature.',
                onSubmit: async () =>
                    await setRetentionDaysMutation({
                        variables: { password, days: currentSettings.retentionDays }
                    })
            }
        ],
        [
            currentSettings.failureRetries,
            currentSettings.pollingInterval,
            currentSettings.pollingTimeout,
            currentSettings.ppmWindow,
            currentSettings.referenceServer,
            currentSettings.retentionDays,
            password,
            setFailureRetriesMutation,
            setPollingIntervalMutation,
            setPollingTimeoutMutation,
            setPpmWindowMutation,
            setReferenceNtpServerMutation,
            setRetentionDaysMutation
        ]
    );

    const {
        data: getSettingsDataData,
        loading: getSettingsDataLoading,
        error: getSettingsDataError,
        refetch: getSettingsDataRefetch
    } = useGetSettingsDataQuery({
        variables: { password }
    });
    useEffect(() => {
        if (!getSettingsDataLoading && !getSettingsDataError && getSettingsDataData) {
            setCurrentSettings({
                failureRetries: getSettingsDataData.getGlobalSettings.failureRetries,
                pollingInterval: getSettingsDataData.getGlobalSettings.pollingInterval,
                pollingTimeout: getSettingsDataData.getGlobalSettings.pollingTimeout,
                ppmWindow: getSettingsDataData.getGlobalSettings.ppmWindow,
                referenceServer: getSettingsDataData.getGlobalSettings.referenceServer,
                retentionDays: getSettingsDataData.getGlobalSettings.retentionDays
            });
        }
    }, [getSettingsDataData, getSettingsDataError, getSettingsDataLoading]);

    const [ntpServerList, setNtpServerList] = useState<Array<INtpServer>>([]);
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
            setNtpServerList(
                getObserveNtpServerListData.getObserveNTPServerList.map((item) => ({ ...item }))
            );
        }
    }, [getObserveNtpServerListData, getObserveNtpServerListError, getObserveNtpServerListLoading]);

    const [addObserveNTPServer, { loading: addObserveNtpServerLoading }] =
        useAddObserveNtpServerMutation();
    const handleAddNewNtpServer = async () => {
        if (!newNtpServerForm.name.trim().length || !newNtpServerForm.address.trim().length) {
            return;
        }
        try {
            const { name, address, remark } = newNtpServerForm;
            await addObserveNTPServer({ variables: { password, name, address, remark } });
            await getObserveNtpServerRefetch();
            setNewNtpServerForm({ name: '', address: '', remark: '' });
        } catch {
            /* empty */
        }
    };

    const [newNtpServerForm, setNewNtpServerForm] = useState({ name: '', address: '', remark: '' });
    const [editingNtpServerForm, setEditingNtpServerForm] = useState<Partial<INtpServer>>({});
    const [updateObserveNtpServer, { loading: updateObserveNtpServerLoading }] =
        useUpdateObserveNtpServerMutation();
    const handleUpdateNtpServer = async () => {
        try {
            const { name, address, remark } = editingNtpServerForm;
            await updateObserveNtpServer({
                variables: {
                    password,
                    name,
                    address,
                    remark,
                    uuid: editingNtpServerForm.uuid!
                }
            });
            await getObserveNtpServerRefetch();
            setEditingNtpServerForm({});
        } catch {
            /* empty */
        }
    };

    const [removeObserveNtpServer, { loading: removeObserveNtpServerLoading }] =
        useRemoveObserveNtpServerMutation();
    const handleRemoveNtpServer = async (uuid: string) => {
        confirm('Are you sure to remove this NTP server?');
        try {
            await removeObserveNtpServer({ variables: { password, uuid } });
            await getObserveNtpServerRefetch();
        } catch {
            /* empty */
        }
    };

    return (
        <div className="mx-4 flex flex-col space-y-6 md:mt-6">
            <div className="mb-4 flex flex-col space-y-2 space-x-4 md:flex-row md:items-center">
                <h2 className="text-4xl font-extrabold text-gray-800">Global Settings</h2>
                <button
                    className="btn btn-sm max-w-fit"
                    onClick={async () => {
                        await getSettingsDataRefetch();
                        await getObserveNtpServerRefetch();
                    }}
                >
                    <Icon path={mdiRefresh} size={0.85} className="opacity-80" />
                    <span>Refresh</span>
                </button>
            </div>

            <div className="flex flex-wrap gap-2">
                <button
                    className="btn btn-sm bg-red-500 text-white"
                    onClick={handlePurgeOffsetRecords}
                >
                    <span>Purge Offset Records</span>
                </button>
                <button
                    className="btn btn-sm bg-red-500 text-white"
                    onClick={handlePurgeDriftRecords}
                >
                    <span>Purge Drift Records</span>
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {settingsFields.map(({ id, title, description, type, onSubmit }) => (
                    <div
                        key={id}
                        className="bg-base-100 flex w-full flex-col rounded-md p-6 shadow"
                    >
                        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                        <p className="mt-1 text-sm text-gray-600">{description}</p>

                        <div className="flex-1" />

                        <div className="mt-4 flex items-center gap-3">
                            <input
                                className="input input-sm flex-1 outline-0"
                                value={currentSettings[id as keyof ISettings]}
                                onChange={(e) =>
                                    setCurrentSettings((prev) => ({
                                        ...prev,
                                        [id]:
                                            type === 'number'
                                                ? Number(e.target.value)
                                                : e.target.value
                                    }))
                                }
                                type={type}
                            />
                            <button
                                className="btn btn-sm"
                                onClick={async () => {
                                    setSettingsApplyingState({
                                        ...settingsApplyingState,
                                        [id]: true
                                    });
                                    try {
                                        await onSubmit();
                                        await getSettingsDataRefetch();
                                    } catch {
                                        /* empty */
                                    }
                                    setSettingsApplyingState({
                                        ...settingsApplyingState,
                                        [id]: false
                                    });
                                }}
                                disabled={
                                    settingsApplyingState[id as keyof typeof settingsApplyingState]
                                }
                            >
                                {settingsApplyingState[id as keyof typeof settingsApplyingState]
                                    ? 'Applying'
                                    : 'Apply'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-base-100 rounded-md p-6 shadow">
                <div className="mb-4 flex flex-col justify-between">
                    <h3 className="text-xl font-bold text-gray-800">Observation NTP Servers</h3>
                    <p className="mt-1 text-sm text-gray-600">
                        Servers listed below are used for continuous offset observation.
                    </p>
                </div>

                <div className="overflow-x-scroll text-nowrap">
                    <table className="table-md table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Remark</th>
                                <th>Created At</th>
                                <th>Updated At</th>
                                <th />
                            </tr>
                        </thead>

                        <tbody>
                            <tr className="bg-base-200">
                                <td>
                                    <input
                                        className="input input-sm w-full outline-0"
                                        value={newNtpServerForm.name}
                                        placeholder="Name"
                                        onChange={({ target }) =>
                                            setNewNtpServerForm({
                                                ...newNtpServerForm,
                                                name: target.value
                                            })
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        className="input input-sm w-full outline-0"
                                        value={newNtpServerForm.address}
                                        placeholder="Address"
                                        onChange={({ target }) =>
                                            setNewNtpServerForm({
                                                ...newNtpServerForm,
                                                address: target.value
                                            })
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        className="input input-sm w-full outline-0"
                                        value={newNtpServerForm.remark}
                                        placeholder="Remark"
                                        onChange={({ target }) =>
                                            setNewNtpServerForm({
                                                ...newNtpServerForm,
                                                remark: target.value
                                            })
                                        }
                                    />
                                </td>

                                <td colSpan={2} />

                                <td>
                                    <button
                                        className="btn btn-xs"
                                        onClick={handleAddNewNtpServer}
                                        disabled={addObserveNtpServerLoading}
                                    >
                                        Add
                                    </button>
                                </td>
                            </tr>

                            {ntpServerList
                                .sort((a, b) => b.createdAt - a.createdAt)
                                .map(({ uuid, name, address, remark, createdAt, updatedAt }) =>
                                    editingNtpServerForm.uuid === uuid ? (
                                        <tr key={uuid} className="hover:bg-base-200">
                                            <td>
                                                <input
                                                    className="input input-sm w-full outline-0"
                                                    value={editingNtpServerForm.name ?? ''}
                                                    onChange={({ target }) =>
                                                        setEditingNtpServerForm({
                                                            ...editingNtpServerForm,
                                                            name: target.value
                                                        })
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    className="input input-sm w-full outline-0"
                                                    value={editingNtpServerForm.address ?? ''}
                                                    onChange={({ target }) =>
                                                        setEditingNtpServerForm({
                                                            ...editingNtpServerForm,
                                                            address: target.value
                                                        })
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    className="input input-sm w-full outline-0"
                                                    value={editingNtpServerForm.remark ?? ''}
                                                    onChange={({ target }) =>
                                                        setEditingNtpServerForm({
                                                            ...editingNtpServerForm,
                                                            remark: target.value
                                                        })
                                                    }
                                                />
                                            </td>
                                            <td>{new Date(createdAt).toLocaleString('en-US')}</td>
                                            <td>{new Date(updatedAt).toLocaleString('en-US')}</td>
                                            <td className="flex gap-2">
                                                <button
                                                    className="btn btn-xs"
                                                    onClick={handleUpdateNtpServer}
                                                    disabled={updateObserveNtpServerLoading}
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    className="btn btn-xs"
                                                    onClick={() => setEditingNtpServerForm({})}
                                                >
                                                    Cancel
                                                </button>
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr key={uuid} className="hover:bg-base-200">
                                            <td>{name}</td>
                                            <td className="font-mono">{address}</td>
                                            <td>{remark}</td>
                                            <td>{new Date(createdAt).toLocaleString()}</td>
                                            <td>{new Date(updatedAt).toLocaleString()}</td>
                                            <td className="flex gap-2">
                                                <button
                                                    className="btn btn-xs"
                                                    onClick={() => {
                                                        setEditingNtpServerForm({
                                                            uuid,
                                                            name,
                                                            address,
                                                            remark
                                                        });
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btn btn-xs"
                                                    onClick={() => handleRemoveNtpServer(uuid)}
                                                    disabled={removeObserveNtpServerLoading}
                                                >
                                                    Del
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
