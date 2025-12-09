interface IGlobalConfig {
    readonly name: string;
    readonly description: string;
    readonly repository: string;
    readonly update: number;
}

export const globalConfig: IGlobalConfig = {
    name: 'NTP Monitor',
    description:
        'An NTP monitoring service that tracks offsets across multiple servers and calculates local clock drift.',
    update: 10 * 60 * 1000,
    repository: 'https://github.com/bclswl0827/ntpmonitor'
};
