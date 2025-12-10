import { gql } from '@apollo/client';
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Any: { input: any; output: any; }
  Int32: { input: number; output: number; }
  Int64: { input: number; output: number; }
  Map: { input: any; output: any; }
};

export type ClockDrift = {
  __typename?: 'ClockDrift';
  longTermDrift: Scalars['Float']['output'];
  reference: Scalars['String']['output'];
  shortTermDrift: Scalars['Float']['output'];
  timestamp: Scalars['Int64']['output'];
};

export type GlobalSettings = {
  __typename?: 'GlobalSettings';
  failureRetries: Scalars['Int64']['output'];
  pollingInterval: Scalars['Int64']['output'];
  pollingTimeout: Scalars['Int64']['output'];
  ppmWindow: Scalars['Int64']['output'];
  referenceServer: Scalars['String']['output'];
  retentionDays: Scalars['Int64']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addObserveNTPServer: Scalars['Boolean']['output'];
  purgeClockDrifts: Scalars['Boolean']['output'];
  purgeNTPOffsets: Scalars['Boolean']['output'];
  removeObserveNTPServer: Scalars['Boolean']['output'];
  setFailureRetries: Scalars['Boolean']['output'];
  setPPMWindow: Scalars['Boolean']['output'];
  setPollingInterval: Scalars['Boolean']['output'];
  setPollingTimeout: Scalars['Boolean']['output'];
  setReferenceNTPServer: Scalars['Boolean']['output'];
  setRetentionDays: Scalars['Boolean']['output'];
  updateObserveNTPServer: Scalars['Boolean']['output'];
};


export type MutationAddObserveNtpServerArgs = {
  address: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  remark?: InputMaybe<Scalars['String']['input']>;
};


export type MutationPurgeClockDriftsArgs = {
  before?: InputMaybe<Scalars['Int64']['input']>;
  password: Scalars['String']['input'];
};


export type MutationPurgeNtpOffsetsArgs = {
  before?: InputMaybe<Scalars['Int64']['input']>;
  password: Scalars['String']['input'];
};


export type MutationRemoveObserveNtpServerArgs = {
  password: Scalars['String']['input'];
  uuid: Scalars['String']['input'];
};


export type MutationSetFailureRetriesArgs = {
  password: Scalars['String']['input'];
  retries: Scalars['Int32']['input'];
};


export type MutationSetPpmWindowArgs = {
  password: Scalars['String']['input'];
  window: Scalars['Int64']['input'];
};


export type MutationSetPollingIntervalArgs = {
  interval: Scalars['Int64']['input'];
  password: Scalars['String']['input'];
};


export type MutationSetPollingTimeoutArgs = {
  password: Scalars['String']['input'];
  timeout: Scalars['Int64']['input'];
};


export type MutationSetReferenceNtpServerArgs = {
  password: Scalars['String']['input'];
  server: Scalars['String']['input'];
};


export type MutationSetRetentionDaysArgs = {
  days: Scalars['Int64']['input'];
  password: Scalars['String']['input'];
};


export type MutationUpdateObserveNtpServerArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  remark?: InputMaybe<Scalars['String']['input']>;
  uuid: Scalars['String']['input'];
};

export type NtpServer = {
  __typename?: 'NTPServer';
  address: Scalars['String']['output'];
  createdAt: Scalars['Int64']['output'];
  name: Scalars['String']['output'];
  remark: Scalars['String']['output'];
  updatedAt: Scalars['Int64']['output'];
  uuid: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  getClockDrifts: Array<ClockDrift>;
  getCurrentTime: RemoteTime;
  getGlobalSettings: GlobalSettings;
  getObserveNTPServerList: Array<NtpServer>;
  getServerOffsets: Array<ServerOffset>;
  verifyPassword: Scalars['Boolean']['output'];
};


export type QueryGetClockDriftsArgs = {
  end?: InputMaybe<Scalars['Int64']['input']>;
  start: Scalars['Int64']['input'];
};


export type QueryGetGlobalSettingsArgs = {
  password: Scalars['String']['input'];
};


export type QueryGetServerOffsetsArgs = {
  end?: InputMaybe<Scalars['Int64']['input']>;
  start: Scalars['Int64']['input'];
  uuid: Scalars['String']['input'];
};


export type QueryVerifyPasswordArgs = {
  password: Scalars['String']['input'];
};

export type RemoteTime = {
  __typename?: 'RemoteTime';
  reference: Scalars['String']['output'];
  syncedAt: Scalars['Int64']['output'];
  timestamp: Scalars['Int64']['output'];
};

export type ServerOffset = {
  __typename?: 'ServerOffset';
  offset: Scalars['Int64']['output'];
  reference: Scalars['String']['output'];
  rootDelay: Scalars['Int64']['output'];
  rootDispersion: Scalars['Int64']['output'];
  rootDistance: Scalars['Int64']['output'];
  roundTrip: Scalars['Int64']['output'];
  serverRefId: Scalars['String']['output'];
  stratum: Scalars['Int']['output'];
  timestamp: Scalars['Int64']['output'];
};

export type GetClockDriftsQueryVariables = Exact<{
  start: Scalars['Int64']['input'];
  end?: InputMaybe<Scalars['Int64']['input']>;
}>;


export type GetClockDriftsQuery = { __typename?: 'Query', getClockDrifts: Array<{ __typename?: 'ClockDrift', timestamp: number, reference: string, longTermDrift: number, shortTermDrift: number }> };

export type GetCurrentTimeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentTimeQuery = { __typename?: 'Query', getCurrentTime: { __typename?: 'RemoteTime', timestamp: number, syncedAt: number, reference: string } };

export type GetObserveNtpServerListQueryVariables = Exact<{ [key: string]: never; }>;


export type GetObserveNtpServerListQuery = { __typename?: 'Query', getCurrentTime: { __typename?: 'RemoteTime', timestamp: number }, getObserveNTPServerList: Array<{ __typename?: 'NTPServer', uuid: string, name: string, address: string, remark: string, updatedAt: number, createdAt: number }> };

export type GetServerOffsetsQueryVariables = Exact<{
  uuid: Scalars['String']['input'];
  start: Scalars['Int64']['input'];
  end?: InputMaybe<Scalars['Int64']['input']>;
}>;


export type GetServerOffsetsQuery = { __typename?: 'Query', getServerOffsets: Array<{ __typename?: 'ServerOffset', timestamp: number, reference: string, offset: number, roundTrip: number, rootDelay: number, rootDispersion: number, rootDistance: number, stratum: number, serverRefId: string }> };

export type AddObserveNtpServerMutationVariables = Exact<{
  password: Scalars['String']['input'];
  name: Scalars['String']['input'];
  address: Scalars['String']['input'];
  remark?: InputMaybe<Scalars['String']['input']>;
}>;


export type AddObserveNtpServerMutation = { __typename?: 'Mutation', addObserveNTPServer: boolean };

export type GetSettingsDataQueryVariables = Exact<{
  password: Scalars['String']['input'];
}>;


export type GetSettingsDataQuery = { __typename?: 'Query', getGlobalSettings: { __typename?: 'GlobalSettings', failureRetries: number, pollingInterval: number, pollingTimeout: number, ppmWindow: number, referenceServer: string, retentionDays: number } };

export type PurgeClockDriftsMutationVariables = Exact<{
  password: Scalars['String']['input'];
  before?: InputMaybe<Scalars['Int64']['input']>;
}>;


export type PurgeClockDriftsMutation = { __typename?: 'Mutation', purgeClockDrifts: boolean };

export type PurgeNtpOffsetsMutationVariables = Exact<{
  password: Scalars['String']['input'];
  before?: InputMaybe<Scalars['Int64']['input']>;
}>;


export type PurgeNtpOffsetsMutation = { __typename?: 'Mutation', purgeNTPOffsets: boolean };

export type RemoveObserveNtpServerMutationVariables = Exact<{
  password: Scalars['String']['input'];
  uuid: Scalars['String']['input'];
}>;


export type RemoveObserveNtpServerMutation = { __typename?: 'Mutation', removeObserveNTPServer: boolean };

export type SetFailureRetriesMutationVariables = Exact<{
  password: Scalars['String']['input'];
  retries: Scalars['Int32']['input'];
}>;


export type SetFailureRetriesMutation = { __typename?: 'Mutation', setFailureRetries: boolean };

export type SetPpmWindowMutationVariables = Exact<{
  password: Scalars['String']['input'];
  window: Scalars['Int64']['input'];
}>;


export type SetPpmWindowMutation = { __typename?: 'Mutation', setPPMWindow: boolean };

export type SetPollingIntervalMutationVariables = Exact<{
  password: Scalars['String']['input'];
  interval: Scalars['Int64']['input'];
}>;


export type SetPollingIntervalMutation = { __typename?: 'Mutation', setPollingInterval: boolean };

export type SetPollingTimeoutMutationVariables = Exact<{
  password: Scalars['String']['input'];
  timeout: Scalars['Int64']['input'];
}>;


export type SetPollingTimeoutMutation = { __typename?: 'Mutation', setPollingTimeout: boolean };

export type SetReferenceNtpServerMutationVariables = Exact<{
  password: Scalars['String']['input'];
  server: Scalars['String']['input'];
}>;


export type SetReferenceNtpServerMutation = { __typename?: 'Mutation', setReferenceNTPServer: boolean };

export type SetRetentionDaysMutationVariables = Exact<{
  password: Scalars['String']['input'];
  days: Scalars['Int64']['input'];
}>;


export type SetRetentionDaysMutation = { __typename?: 'Mutation', setRetentionDays: boolean };

export type UpdateObserveNtpServerMutationVariables = Exact<{
  password: Scalars['String']['input'];
  uuid: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  address?: InputMaybe<Scalars['String']['input']>;
  remark?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateObserveNtpServerMutation = { __typename?: 'Mutation', updateObserveNTPServer: boolean };

export type VerifyPasswordQueryVariables = Exact<{
  password: Scalars['String']['input'];
}>;


export type VerifyPasswordQuery = { __typename?: 'Query', verifyPassword: boolean };


export const GetClockDriftsDocument = gql`
    query getClockDrifts($start: Int64!, $end: Int64) {
  getClockDrifts(start: $start, end: $end) {
    timestamp
    reference
    longTermDrift
    shortTermDrift
  }
}
    `;

/**
 * __useGetClockDriftsQuery__
 *
 * To run a query within a React component, call `useGetClockDriftsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClockDriftsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClockDriftsQuery({
 *   variables: {
 *      start: // value for 'start'
 *      end: // value for 'end'
 *   },
 * });
 */
export function useGetClockDriftsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetClockDriftsQuery, GetClockDriftsQueryVariables> & ({ variables: GetClockDriftsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetClockDriftsQuery, GetClockDriftsQueryVariables>(GetClockDriftsDocument, options);
      }
export function useGetClockDriftsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetClockDriftsQuery, GetClockDriftsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetClockDriftsQuery, GetClockDriftsQueryVariables>(GetClockDriftsDocument, options);
        }
export function useGetClockDriftsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetClockDriftsQuery, GetClockDriftsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetClockDriftsQuery, GetClockDriftsQueryVariables>(GetClockDriftsDocument, options);
        }
export type GetClockDriftsQueryHookResult = ReturnType<typeof useGetClockDriftsQuery>;
export type GetClockDriftsLazyQueryHookResult = ReturnType<typeof useGetClockDriftsLazyQuery>;
export type GetClockDriftsSuspenseQueryHookResult = ReturnType<typeof useGetClockDriftsSuspenseQuery>;
export type GetClockDriftsQueryResult = ApolloReactCommon.QueryResult<GetClockDriftsQuery, GetClockDriftsQueryVariables>;
export const GetCurrentTimeDocument = gql`
    query getCurrentTime {
  getCurrentTime {
    timestamp
    syncedAt
    reference
  }
}
    `;

/**
 * __useGetCurrentTimeQuery__
 *
 * To run a query within a React component, call `useGetCurrentTimeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentTimeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentTimeQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentTimeQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetCurrentTimeQuery, GetCurrentTimeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetCurrentTimeQuery, GetCurrentTimeQueryVariables>(GetCurrentTimeDocument, options);
      }
export function useGetCurrentTimeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetCurrentTimeQuery, GetCurrentTimeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetCurrentTimeQuery, GetCurrentTimeQueryVariables>(GetCurrentTimeDocument, options);
        }
export function useGetCurrentTimeSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetCurrentTimeQuery, GetCurrentTimeQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetCurrentTimeQuery, GetCurrentTimeQueryVariables>(GetCurrentTimeDocument, options);
        }
export type GetCurrentTimeQueryHookResult = ReturnType<typeof useGetCurrentTimeQuery>;
export type GetCurrentTimeLazyQueryHookResult = ReturnType<typeof useGetCurrentTimeLazyQuery>;
export type GetCurrentTimeSuspenseQueryHookResult = ReturnType<typeof useGetCurrentTimeSuspenseQuery>;
export type GetCurrentTimeQueryResult = ApolloReactCommon.QueryResult<GetCurrentTimeQuery, GetCurrentTimeQueryVariables>;
export const GetObserveNtpServerListDocument = gql`
    query getObserveNTPServerList {
  getCurrentTime {
    timestamp
  }
  getObserveNTPServerList {
    uuid
    name
    address
    remark
    updatedAt
    createdAt
  }
}
    `;

/**
 * __useGetObserveNtpServerListQuery__
 *
 * To run a query within a React component, call `useGetObserveNtpServerListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetObserveNtpServerListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetObserveNtpServerListQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetObserveNtpServerListQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetObserveNtpServerListQuery, GetObserveNtpServerListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetObserveNtpServerListQuery, GetObserveNtpServerListQueryVariables>(GetObserveNtpServerListDocument, options);
      }
export function useGetObserveNtpServerListLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetObserveNtpServerListQuery, GetObserveNtpServerListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetObserveNtpServerListQuery, GetObserveNtpServerListQueryVariables>(GetObserveNtpServerListDocument, options);
        }
export function useGetObserveNtpServerListSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetObserveNtpServerListQuery, GetObserveNtpServerListQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetObserveNtpServerListQuery, GetObserveNtpServerListQueryVariables>(GetObserveNtpServerListDocument, options);
        }
export type GetObserveNtpServerListQueryHookResult = ReturnType<typeof useGetObserveNtpServerListQuery>;
export type GetObserveNtpServerListLazyQueryHookResult = ReturnType<typeof useGetObserveNtpServerListLazyQuery>;
export type GetObserveNtpServerListSuspenseQueryHookResult = ReturnType<typeof useGetObserveNtpServerListSuspenseQuery>;
export type GetObserveNtpServerListQueryResult = ApolloReactCommon.QueryResult<GetObserveNtpServerListQuery, GetObserveNtpServerListQueryVariables>;
export const GetServerOffsetsDocument = gql`
    query getServerOffsets($uuid: String!, $start: Int64!, $end: Int64) {
  getServerOffsets(uuid: $uuid, start: $start, end: $end) {
    timestamp
    reference
    offset
    roundTrip
    rootDelay
    rootDispersion
    rootDistance
    stratum
    serverRefId
  }
}
    `;

/**
 * __useGetServerOffsetsQuery__
 *
 * To run a query within a React component, call `useGetServerOffsetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetServerOffsetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetServerOffsetsQuery({
 *   variables: {
 *      uuid: // value for 'uuid'
 *      start: // value for 'start'
 *      end: // value for 'end'
 *   },
 * });
 */
export function useGetServerOffsetsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetServerOffsetsQuery, GetServerOffsetsQueryVariables> & ({ variables: GetServerOffsetsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetServerOffsetsQuery, GetServerOffsetsQueryVariables>(GetServerOffsetsDocument, options);
      }
export function useGetServerOffsetsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetServerOffsetsQuery, GetServerOffsetsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetServerOffsetsQuery, GetServerOffsetsQueryVariables>(GetServerOffsetsDocument, options);
        }
export function useGetServerOffsetsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetServerOffsetsQuery, GetServerOffsetsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetServerOffsetsQuery, GetServerOffsetsQueryVariables>(GetServerOffsetsDocument, options);
        }
export type GetServerOffsetsQueryHookResult = ReturnType<typeof useGetServerOffsetsQuery>;
export type GetServerOffsetsLazyQueryHookResult = ReturnType<typeof useGetServerOffsetsLazyQuery>;
export type GetServerOffsetsSuspenseQueryHookResult = ReturnType<typeof useGetServerOffsetsSuspenseQuery>;
export type GetServerOffsetsQueryResult = ApolloReactCommon.QueryResult<GetServerOffsetsQuery, GetServerOffsetsQueryVariables>;
export const AddObserveNtpServerDocument = gql`
    mutation addObserveNTPServer($password: String!, $name: String!, $address: String!, $remark: String) {
  addObserveNTPServer(
    password: $password
    name: $name
    address: $address
    remark: $remark
  )
}
    `;
export type AddObserveNtpServerMutationFn = ApolloReactCommon.MutationFunction<AddObserveNtpServerMutation, AddObserveNtpServerMutationVariables>;

/**
 * __useAddObserveNtpServerMutation__
 *
 * To run a mutation, you first call `useAddObserveNtpServerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddObserveNtpServerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addObserveNtpServerMutation, { data, loading, error }] = useAddObserveNtpServerMutation({
 *   variables: {
 *      password: // value for 'password'
 *      name: // value for 'name'
 *      address: // value for 'address'
 *      remark: // value for 'remark'
 *   },
 * });
 */
export function useAddObserveNtpServerMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AddObserveNtpServerMutation, AddObserveNtpServerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<AddObserveNtpServerMutation, AddObserveNtpServerMutationVariables>(AddObserveNtpServerDocument, options);
      }
export type AddObserveNtpServerMutationHookResult = ReturnType<typeof useAddObserveNtpServerMutation>;
export type AddObserveNtpServerMutationResult = ApolloReactCommon.MutationResult<AddObserveNtpServerMutation>;
export type AddObserveNtpServerMutationOptions = ApolloReactCommon.BaseMutationOptions<AddObserveNtpServerMutation, AddObserveNtpServerMutationVariables>;
export const GetSettingsDataDocument = gql`
    query getSettingsData($password: String!) {
  getGlobalSettings(password: $password) {
    failureRetries
    pollingInterval
    pollingTimeout
    ppmWindow
    referenceServer
    retentionDays
  }
}
    `;

/**
 * __useGetSettingsDataQuery__
 *
 * To run a query within a React component, call `useGetSettingsDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSettingsDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSettingsDataQuery({
 *   variables: {
 *      password: // value for 'password'
 *   },
 * });
 */
export function useGetSettingsDataQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetSettingsDataQuery, GetSettingsDataQueryVariables> & ({ variables: GetSettingsDataQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetSettingsDataQuery, GetSettingsDataQueryVariables>(GetSettingsDataDocument, options);
      }
export function useGetSettingsDataLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetSettingsDataQuery, GetSettingsDataQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetSettingsDataQuery, GetSettingsDataQueryVariables>(GetSettingsDataDocument, options);
        }
export function useGetSettingsDataSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetSettingsDataQuery, GetSettingsDataQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetSettingsDataQuery, GetSettingsDataQueryVariables>(GetSettingsDataDocument, options);
        }
export type GetSettingsDataQueryHookResult = ReturnType<typeof useGetSettingsDataQuery>;
export type GetSettingsDataLazyQueryHookResult = ReturnType<typeof useGetSettingsDataLazyQuery>;
export type GetSettingsDataSuspenseQueryHookResult = ReturnType<typeof useGetSettingsDataSuspenseQuery>;
export type GetSettingsDataQueryResult = ApolloReactCommon.QueryResult<GetSettingsDataQuery, GetSettingsDataQueryVariables>;
export const PurgeClockDriftsDocument = gql`
    mutation purgeClockDrifts($password: String!, $before: Int64) {
  purgeClockDrifts(password: $password, before: $before)
}
    `;
export type PurgeClockDriftsMutationFn = ApolloReactCommon.MutationFunction<PurgeClockDriftsMutation, PurgeClockDriftsMutationVariables>;

/**
 * __usePurgeClockDriftsMutation__
 *
 * To run a mutation, you first call `usePurgeClockDriftsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePurgeClockDriftsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [purgeClockDriftsMutation, { data, loading, error }] = usePurgeClockDriftsMutation({
 *   variables: {
 *      password: // value for 'password'
 *      before: // value for 'before'
 *   },
 * });
 */
export function usePurgeClockDriftsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<PurgeClockDriftsMutation, PurgeClockDriftsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<PurgeClockDriftsMutation, PurgeClockDriftsMutationVariables>(PurgeClockDriftsDocument, options);
      }
export type PurgeClockDriftsMutationHookResult = ReturnType<typeof usePurgeClockDriftsMutation>;
export type PurgeClockDriftsMutationResult = ApolloReactCommon.MutationResult<PurgeClockDriftsMutation>;
export type PurgeClockDriftsMutationOptions = ApolloReactCommon.BaseMutationOptions<PurgeClockDriftsMutation, PurgeClockDriftsMutationVariables>;
export const PurgeNtpOffsetsDocument = gql`
    mutation purgeNTPOffsets($password: String!, $before: Int64) {
  purgeNTPOffsets(password: $password, before: $before)
}
    `;
export type PurgeNtpOffsetsMutationFn = ApolloReactCommon.MutationFunction<PurgeNtpOffsetsMutation, PurgeNtpOffsetsMutationVariables>;

/**
 * __usePurgeNtpOffsetsMutation__
 *
 * To run a mutation, you first call `usePurgeNtpOffsetsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePurgeNtpOffsetsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [purgeNtpOffsetsMutation, { data, loading, error }] = usePurgeNtpOffsetsMutation({
 *   variables: {
 *      password: // value for 'password'
 *      before: // value for 'before'
 *   },
 * });
 */
export function usePurgeNtpOffsetsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<PurgeNtpOffsetsMutation, PurgeNtpOffsetsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<PurgeNtpOffsetsMutation, PurgeNtpOffsetsMutationVariables>(PurgeNtpOffsetsDocument, options);
      }
export type PurgeNtpOffsetsMutationHookResult = ReturnType<typeof usePurgeNtpOffsetsMutation>;
export type PurgeNtpOffsetsMutationResult = ApolloReactCommon.MutationResult<PurgeNtpOffsetsMutation>;
export type PurgeNtpOffsetsMutationOptions = ApolloReactCommon.BaseMutationOptions<PurgeNtpOffsetsMutation, PurgeNtpOffsetsMutationVariables>;
export const RemoveObserveNtpServerDocument = gql`
    mutation removeObserveNTPServer($password: String!, $uuid: String!) {
  removeObserveNTPServer(password: $password, uuid: $uuid)
}
    `;
export type RemoveObserveNtpServerMutationFn = ApolloReactCommon.MutationFunction<RemoveObserveNtpServerMutation, RemoveObserveNtpServerMutationVariables>;

/**
 * __useRemoveObserveNtpServerMutation__
 *
 * To run a mutation, you first call `useRemoveObserveNtpServerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveObserveNtpServerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeObserveNtpServerMutation, { data, loading, error }] = useRemoveObserveNtpServerMutation({
 *   variables: {
 *      password: // value for 'password'
 *      uuid: // value for 'uuid'
 *   },
 * });
 */
export function useRemoveObserveNtpServerMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RemoveObserveNtpServerMutation, RemoveObserveNtpServerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<RemoveObserveNtpServerMutation, RemoveObserveNtpServerMutationVariables>(RemoveObserveNtpServerDocument, options);
      }
export type RemoveObserveNtpServerMutationHookResult = ReturnType<typeof useRemoveObserveNtpServerMutation>;
export type RemoveObserveNtpServerMutationResult = ApolloReactCommon.MutationResult<RemoveObserveNtpServerMutation>;
export type RemoveObserveNtpServerMutationOptions = ApolloReactCommon.BaseMutationOptions<RemoveObserveNtpServerMutation, RemoveObserveNtpServerMutationVariables>;
export const SetFailureRetriesDocument = gql`
    mutation setFailureRetries($password: String!, $retries: Int32!) {
  setFailureRetries(password: $password, retries: $retries)
}
    `;
export type SetFailureRetriesMutationFn = ApolloReactCommon.MutationFunction<SetFailureRetriesMutation, SetFailureRetriesMutationVariables>;

/**
 * __useSetFailureRetriesMutation__
 *
 * To run a mutation, you first call `useSetFailureRetriesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetFailureRetriesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setFailureRetriesMutation, { data, loading, error }] = useSetFailureRetriesMutation({
 *   variables: {
 *      password: // value for 'password'
 *      retries: // value for 'retries'
 *   },
 * });
 */
export function useSetFailureRetriesMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetFailureRetriesMutation, SetFailureRetriesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<SetFailureRetriesMutation, SetFailureRetriesMutationVariables>(SetFailureRetriesDocument, options);
      }
export type SetFailureRetriesMutationHookResult = ReturnType<typeof useSetFailureRetriesMutation>;
export type SetFailureRetriesMutationResult = ApolloReactCommon.MutationResult<SetFailureRetriesMutation>;
export type SetFailureRetriesMutationOptions = ApolloReactCommon.BaseMutationOptions<SetFailureRetriesMutation, SetFailureRetriesMutationVariables>;
export const SetPpmWindowDocument = gql`
    mutation setPPMWindow($password: String!, $window: Int64!) {
  setPPMWindow(password: $password, window: $window)
}
    `;
export type SetPpmWindowMutationFn = ApolloReactCommon.MutationFunction<SetPpmWindowMutation, SetPpmWindowMutationVariables>;

/**
 * __useSetPpmWindowMutation__
 *
 * To run a mutation, you first call `useSetPpmWindowMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetPpmWindowMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setPpmWindowMutation, { data, loading, error }] = useSetPpmWindowMutation({
 *   variables: {
 *      password: // value for 'password'
 *      window: // value for 'window'
 *   },
 * });
 */
export function useSetPpmWindowMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetPpmWindowMutation, SetPpmWindowMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<SetPpmWindowMutation, SetPpmWindowMutationVariables>(SetPpmWindowDocument, options);
      }
export type SetPpmWindowMutationHookResult = ReturnType<typeof useSetPpmWindowMutation>;
export type SetPpmWindowMutationResult = ApolloReactCommon.MutationResult<SetPpmWindowMutation>;
export type SetPpmWindowMutationOptions = ApolloReactCommon.BaseMutationOptions<SetPpmWindowMutation, SetPpmWindowMutationVariables>;
export const SetPollingIntervalDocument = gql`
    mutation setPollingInterval($password: String!, $interval: Int64!) {
  setPollingInterval(password: $password, interval: $interval)
}
    `;
export type SetPollingIntervalMutationFn = ApolloReactCommon.MutationFunction<SetPollingIntervalMutation, SetPollingIntervalMutationVariables>;

/**
 * __useSetPollingIntervalMutation__
 *
 * To run a mutation, you first call `useSetPollingIntervalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetPollingIntervalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setPollingIntervalMutation, { data, loading, error }] = useSetPollingIntervalMutation({
 *   variables: {
 *      password: // value for 'password'
 *      interval: // value for 'interval'
 *   },
 * });
 */
export function useSetPollingIntervalMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetPollingIntervalMutation, SetPollingIntervalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<SetPollingIntervalMutation, SetPollingIntervalMutationVariables>(SetPollingIntervalDocument, options);
      }
export type SetPollingIntervalMutationHookResult = ReturnType<typeof useSetPollingIntervalMutation>;
export type SetPollingIntervalMutationResult = ApolloReactCommon.MutationResult<SetPollingIntervalMutation>;
export type SetPollingIntervalMutationOptions = ApolloReactCommon.BaseMutationOptions<SetPollingIntervalMutation, SetPollingIntervalMutationVariables>;
export const SetPollingTimeoutDocument = gql`
    mutation setPollingTimeout($password: String!, $timeout: Int64!) {
  setPollingTimeout(password: $password, timeout: $timeout)
}
    `;
export type SetPollingTimeoutMutationFn = ApolloReactCommon.MutationFunction<SetPollingTimeoutMutation, SetPollingTimeoutMutationVariables>;

/**
 * __useSetPollingTimeoutMutation__
 *
 * To run a mutation, you first call `useSetPollingTimeoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetPollingTimeoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setPollingTimeoutMutation, { data, loading, error }] = useSetPollingTimeoutMutation({
 *   variables: {
 *      password: // value for 'password'
 *      timeout: // value for 'timeout'
 *   },
 * });
 */
export function useSetPollingTimeoutMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetPollingTimeoutMutation, SetPollingTimeoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<SetPollingTimeoutMutation, SetPollingTimeoutMutationVariables>(SetPollingTimeoutDocument, options);
      }
export type SetPollingTimeoutMutationHookResult = ReturnType<typeof useSetPollingTimeoutMutation>;
export type SetPollingTimeoutMutationResult = ApolloReactCommon.MutationResult<SetPollingTimeoutMutation>;
export type SetPollingTimeoutMutationOptions = ApolloReactCommon.BaseMutationOptions<SetPollingTimeoutMutation, SetPollingTimeoutMutationVariables>;
export const SetReferenceNtpServerDocument = gql`
    mutation setReferenceNTPServer($password: String!, $server: String!) {
  setReferenceNTPServer(password: $password, server: $server)
}
    `;
export type SetReferenceNtpServerMutationFn = ApolloReactCommon.MutationFunction<SetReferenceNtpServerMutation, SetReferenceNtpServerMutationVariables>;

/**
 * __useSetReferenceNtpServerMutation__
 *
 * To run a mutation, you first call `useSetReferenceNtpServerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetReferenceNtpServerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setReferenceNtpServerMutation, { data, loading, error }] = useSetReferenceNtpServerMutation({
 *   variables: {
 *      password: // value for 'password'
 *      server: // value for 'server'
 *   },
 * });
 */
export function useSetReferenceNtpServerMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetReferenceNtpServerMutation, SetReferenceNtpServerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<SetReferenceNtpServerMutation, SetReferenceNtpServerMutationVariables>(SetReferenceNtpServerDocument, options);
      }
export type SetReferenceNtpServerMutationHookResult = ReturnType<typeof useSetReferenceNtpServerMutation>;
export type SetReferenceNtpServerMutationResult = ApolloReactCommon.MutationResult<SetReferenceNtpServerMutation>;
export type SetReferenceNtpServerMutationOptions = ApolloReactCommon.BaseMutationOptions<SetReferenceNtpServerMutation, SetReferenceNtpServerMutationVariables>;
export const SetRetentionDaysDocument = gql`
    mutation setRetentionDays($password: String!, $days: Int64!) {
  setRetentionDays(password: $password, days: $days)
}
    `;
export type SetRetentionDaysMutationFn = ApolloReactCommon.MutationFunction<SetRetentionDaysMutation, SetRetentionDaysMutationVariables>;

/**
 * __useSetRetentionDaysMutation__
 *
 * To run a mutation, you first call `useSetRetentionDaysMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetRetentionDaysMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setRetentionDaysMutation, { data, loading, error }] = useSetRetentionDaysMutation({
 *   variables: {
 *      password: // value for 'password'
 *      days: // value for 'days'
 *   },
 * });
 */
export function useSetRetentionDaysMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetRetentionDaysMutation, SetRetentionDaysMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<SetRetentionDaysMutation, SetRetentionDaysMutationVariables>(SetRetentionDaysDocument, options);
      }
export type SetRetentionDaysMutationHookResult = ReturnType<typeof useSetRetentionDaysMutation>;
export type SetRetentionDaysMutationResult = ApolloReactCommon.MutationResult<SetRetentionDaysMutation>;
export type SetRetentionDaysMutationOptions = ApolloReactCommon.BaseMutationOptions<SetRetentionDaysMutation, SetRetentionDaysMutationVariables>;
export const UpdateObserveNtpServerDocument = gql`
    mutation updateObserveNTPServer($password: String!, $uuid: String!, $name: String, $address: String, $remark: String) {
  updateObserveNTPServer(
    password: $password
    uuid: $uuid
    name: $name
    address: $address
    remark: $remark
  )
}
    `;
export type UpdateObserveNtpServerMutationFn = ApolloReactCommon.MutationFunction<UpdateObserveNtpServerMutation, UpdateObserveNtpServerMutationVariables>;

/**
 * __useUpdateObserveNtpServerMutation__
 *
 * To run a mutation, you first call `useUpdateObserveNtpServerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateObserveNtpServerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateObserveNtpServerMutation, { data, loading, error }] = useUpdateObserveNtpServerMutation({
 *   variables: {
 *      password: // value for 'password'
 *      uuid: // value for 'uuid'
 *      name: // value for 'name'
 *      address: // value for 'address'
 *      remark: // value for 'remark'
 *   },
 * });
 */
export function useUpdateObserveNtpServerMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateObserveNtpServerMutation, UpdateObserveNtpServerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateObserveNtpServerMutation, UpdateObserveNtpServerMutationVariables>(UpdateObserveNtpServerDocument, options);
      }
export type UpdateObserveNtpServerMutationHookResult = ReturnType<typeof useUpdateObserveNtpServerMutation>;
export type UpdateObserveNtpServerMutationResult = ApolloReactCommon.MutationResult<UpdateObserveNtpServerMutation>;
export type UpdateObserveNtpServerMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateObserveNtpServerMutation, UpdateObserveNtpServerMutationVariables>;
export const VerifyPasswordDocument = gql`
    query verifyPassword($password: String!) {
  verifyPassword(password: $password)
}
    `;

/**
 * __useVerifyPasswordQuery__
 *
 * To run a query within a React component, call `useVerifyPasswordQuery` and pass it any options that fit your needs.
 * When your component renders, `useVerifyPasswordQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVerifyPasswordQuery({
 *   variables: {
 *      password: // value for 'password'
 *   },
 * });
 */
export function useVerifyPasswordQuery(baseOptions: ApolloReactHooks.QueryHookOptions<VerifyPasswordQuery, VerifyPasswordQueryVariables> & ({ variables: VerifyPasswordQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<VerifyPasswordQuery, VerifyPasswordQueryVariables>(VerifyPasswordDocument, options);
      }
export function useVerifyPasswordLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<VerifyPasswordQuery, VerifyPasswordQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<VerifyPasswordQuery, VerifyPasswordQueryVariables>(VerifyPasswordDocument, options);
        }
export function useVerifyPasswordSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<VerifyPasswordQuery, VerifyPasswordQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<VerifyPasswordQuery, VerifyPasswordQueryVariables>(VerifyPasswordDocument, options);
        }
export type VerifyPasswordQueryHookResult = ReturnType<typeof useVerifyPasswordQuery>;
export type VerifyPasswordLazyQueryHookResult = ReturnType<typeof useVerifyPasswordLazyQuery>;
export type VerifyPasswordSuspenseQueryHookResult = ReturnType<typeof useVerifyPasswordSuspenseQuery>;
export type VerifyPasswordQueryResult = ApolloReactCommon.QueryResult<VerifyPasswordQuery, VerifyPasswordQueryVariables>;