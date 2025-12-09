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

export type Mutation = {
  __typename?: 'Mutation';
  addObserveNTPServer: Scalars['Boolean']['output'];
  purgeClockDrifts: Scalars['Boolean']['output'];
  purgeNTPOffsets: Scalars['Boolean']['output'];
  removeObserveNTPServer: Scalars['Boolean']['output'];
  setPollingInterval: Scalars['Boolean']['output'];
  setReferenceNTPServer: Scalars['Boolean']['output'];
  updateObserveNTPServer: Scalars['Boolean']['output'];
};


export type MutationAddObserveNtpServerArgs = {
  address: Scalars['String']['input'];
  name: Scalars['String']['input'];
  remark?: InputMaybe<Scalars['String']['input']>;
};


export type MutationPurgeClockDriftsArgs = {
  before?: InputMaybe<Scalars['Int64']['input']>;
};


export type MutationPurgeNtpOffsetsArgs = {
  before?: InputMaybe<Scalars['Int64']['input']>;
};


export type MutationRemoveObserveNtpServerArgs = {
  uuid: Scalars['String']['input'];
};


export type MutationSetPollingIntervalArgs = {
  interval: Scalars['Int64']['input'];
};


export type MutationSetReferenceNtpServerArgs = {
  server: Scalars['String']['input'];
};


export type MutationUpdateObserveNtpServerArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  remark?: InputMaybe<Scalars['String']['input']>;
  uuid: Scalars['String']['input'];
};

export type NtpServer = {
  __typename?: 'NTPServer';
  address: Scalars['String']['output'];
  name: Scalars['String']['output'];
  remark: Scalars['String']['output'];
  updatedAt: Scalars['Int64']['output'];
  uuid: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  getClockDrift: Array<ClockDrift>;
  getCurrentTime: RemoteTime;
  getObserveNTPServerList: Array<NtpServer>;
  getPollingInterval: Scalars['Int64']['output'];
  getReferenceNTPServer: Scalars['String']['output'];
  getServerOffset: Array<ServerOffset>;
};


export type QueryGetClockDriftArgs = {
  end?: InputMaybe<Scalars['Int64']['input']>;
  start: Scalars['Int64']['input'];
};


export type QueryGetServerOffsetArgs = {
  end?: InputMaybe<Scalars['Int64']['input']>;
  start: Scalars['Int64']['input'];
  uuid: Scalars['String']['input'];
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

export type GetCurrentTimeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentTimeQuery = { __typename?: 'Query', getCurrentTime: { __typename?: 'RemoteTime', timestamp: number, syncedAt: number, reference: string } };


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