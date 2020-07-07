import { CromwellBlockDataType, PageInfoType, setStoreItem } from '@cromwell/core';
import { getRestAPIClient } from '@cromwell/core-frontend';
import MuiMenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import React, { Suspense, useEffect, useRef, useState } from 'react';

import { importLazyPage } from '../../../.cromwell/imports/pages.imports.gen';
import PageErrorBoundary from '../../components/errorBoundaries/PageErrorBoundary';
import LoadBox from '../../components/loadBox/LoadBox';
import { Draggable } from '../../helpers/Draggable';
import styles from './ThemeEdit.module.scss';


const MenuItem = withStyles({
    root: {
        width: '100%',
        paddingTop: '12px',
        paddingBottom: '12px'
    },
})(MuiMenuItem);


let draggable;

export default function ThemeEdit() {

    const [pageInfos, setPageInfos] = useState<PageInfoType[] | null>(null);
    const editorWindowRef = useRef<HTMLDivElement>(null);
    const [editingPageConfig, setEditingPageConfig] = useState<PageInfoType | null>(null);
    const [EditingPage, setEditingPage] = useState<React.LazyExoticComponent<React.ComponentType<any>> | null>(null);
    const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
    const [isPageListLoading, setIsPageListLoading] = useState<boolean>(true);
    const [isPageListCollapsed, setIsPageListCollapsed] = useState<boolean>(false);


    useEffect(() => {
        (async () => {
            const infos = await getRestAPIClient().getPagesInfo();
            if (infos) setPageInfos(infos);
            setIsPageListLoading(false);
            draggable = new Draggable();
        })();
    }, []);

    const onOpenPage = async (pageCofig: PageInfoType) => {
        setIsPageLoading(true);
        setIsPageListCollapsed(true);
        const pageModifications: CromwellBlockDataType[] = await getRestAPIClient().getThemeModifications(pageCofig.route);
        console.log('pageModifications', pageModifications);
        setStoreItem('blocksData', pageModifications);

        setEditingPageConfig(pageCofig);
        const pageComp = importLazyPage(pageCofig.route);
        if (pageComp) setEditingPage(pageComp);
        setIsPageLoading(false);

        draggable.setupDraggableBlocks(editorWindowRef.current, '.CromwellBlock', styles.dragFrame);

        // // dragula
        // // temp timeout
        // setTimeout(() => {
        //     const draggableBlocks = document.querySelectorAll<HTMLDivElement>('.CromwellBlock');
        //     // console.log('draggableBlocks', this.draggableBlocks);
        //     draggableBlocks.forEach(b => {
        //         const draggableFrame: HTMLDivElement = document.createElement('div');
        //         draggableFrame.classList.add(styles.dragFrame);

        //         draggableFrame.onclick = () => {
        //             console.log('draggableElement', b.id);
        //         }
        //         b.appendChild(draggableFrame);

        //         const parent = b.parentElement;
        //         if (parent) parent.classList.add('CromwellBlockList');
        //     });
        //     dragula(Array.from(document.getElementsByClassName('CromwellBlockList')), {
        //         mirrorContainer: document.body,
        //         revertOnSpill: true,
        //         // moves: function (el, container, handle) {
        //         //     return handle.classList.contains('handle');
        //         // }
        //     });
        // }, 100)

    }

    return (
        <div className={styles.ThemeEdit}>
            <div>
                {isPageListLoading && (
                    <LoadBox />
                )}
                {!isPageListLoading && !isPageListCollapsed &&
                    pageInfos && pageInfos.map(p => (
                        <div onClick={() => { onOpenPage(p) }}>
                            <MenuItem>
                                <p>{p.name}</p>
                            </MenuItem>
                        </div>
                    ))}
                {
                    !isPageListLoading && isPageListCollapsed && (
                        <MenuItem
                            onClick={() => { setIsPageListCollapsed(false) }}
                        >{'<--'}</MenuItem>
                    )
                }
            </div>
            {/* {editingPage && (
                <div>
                    <iframe
                        src={`${frontendUrl}/${editingPage.route}`}
                        ref={editingFrameRef}
                    />
                </div>
            )} */}
            {isPageLoading && (<LoadBox />)}
            {!isPageLoading && EditingPage && isPageListCollapsed && (
                <div className={styles.EditorWindow} ref={editorWindowRef}>
                    <PageErrorBoundary>
                        <Suspense fallback={<LoadBox />}>
                            <EditingPage />
                        </Suspense>
                    </PageErrorBoundary>
                </div>
            )}
        </div>
    )
}