import { gql } from '@apollo/client';
import { getGraphQLClient, WidgetTypes, getPluginStaticUrl } from '@cromwell/core-frontend';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useStyles } from './styles';

export const Dashboard = (props: WidgetTypes['Dashboard']) => {
    const [newsletterCount, setNewsletterCount] = useState('')
    const classes = useStyles();
    const widgetKey = '@cromwell/plugin-newsletter';

    useEffect(() => {
        getStats();
        props?.setSize?.(widgetKey, {
            lg: { w: 3, h: 3 },
            md: { w: 3, h: 3 },
            sm: { w: 2, h: 3 },
            xs: { w: 2, h: 3 },
            xxs: { w: 2, h: 3 },
        });

    }, []);

    const getStats = async () => {
        const client = getGraphQLClient('plugin');
        const data = await client?.query({
            query: gql`
                query pluginNewsletterStats {
                    pluginNewsletterStats
                }
            `,
        });
        const count = data?.data?.pluginNewsletterStats;
        setNewsletterCount(count ?? '')
    }

    return (
        <div className={classes.dashboard}>
            <img src={`${getPluginStaticUrl('@cromwell/plugin-newsletter')}/icon_email.png`}
                className={classes.dashboardIcon}></img>
            <h3 className={classes.dashboardText}>{newsletterCount} total newsletters</h3>
        </div>
    );
}