import { gql } from '@apollo/client';
import { getBlockInstance, TPagedParams, TPost, TPostFilter, TTag, TUser } from '@cromwell/core';
import { CList, getGraphQLClient, TCList } from '@cromwell/core-frontend';
import { AddCircle as AddCircleIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Autocomplete, Checkbox, IconButton, MenuItem, Select, TextField, Tooltip } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { connect, PropsType } from 'react-redux-ts';
import { useHistory } from 'react-router-dom';
import { debounce } from 'throttle-debounce';

import { LoadingStatus } from '../../components/loadBox/LoadingStatus';
import ConfirmationModal from '../../components/modal/Confirmation';
import Pagination from '../../components/pagination/Pagination';
import { listPreloader } from '../../components/skeleton/SkeletonPreloader';
import { toast } from '../../components/toast/toast';
import { postPageInfo } from '../../constants/PageInfos';
import {
    countSelectedItems,
    getSelectedInput,
    resetSelected,
    toggleItemSelection,
    toggleSelectAll,
} from '../../redux/helpers';
import { TAppState } from '../../redux/store';
import commonStyles from '../../styles/common.module.scss';
import styles from './PostList.module.scss';
import PostListItem from './PostListItem';

export type ListItemProps = {
    handleDeletePostBtnClick: (post: TPost) => void;
    toggleSelection: (data: TPost) => void;
}

const mapStateToProps = (state: TAppState) => {
    return {
        allSelected: state.allSelected,
    }
}

type TPropsType = PropsType<TAppState, Record<string, unknown>,
    ReturnType<typeof mapStateToProps>>;

const PostList = (props: TPropsType) => {
    const client = getGraphQLClient();
    const filterInput = useRef<TPostFilter>({});
    const titleSearchId = "post-filter-search";
    const listId = "Admin_PostList";
    const [users, setUsers] = useState<TUser[] | null>(null);
    const [tags, setTags] = useState<TTag[] | null>(null);
    const [postToDelete, setPostToDelete] = useState<TPost | null>(null);
    const history = useHistory();
    const [deleteSelectedOpen, setDeleteSelectedOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const totalElements = useRef<number | null>(null);

    useEffect(() => {
        resetSelected();

        return () => {
            resetSelected();
        }
    }, [])

    const getUsers = async () => {
        const administrators = await client.getFilteredUsers({
            pagedParams: {
                pageSize: 9999
            },
            filterParams: {
                role: 'administrator'
            }
        });
        const authors = await client.getFilteredUsers({
            pagedParams: {
                pageSize: 9999
            },
            filterParams: {
                role: 'author'
            }
        });
        setUsers([...(administrators?.elements ?? []), ...(authors?.elements ?? [])]);
    }

    const getPostTags = async () => {
        const data = (await client?.getTags({ pageSize: 99999 }))?.elements;
        if (data && Array.isArray(data)) {
            setTags(data.sort((a, b) => a.name < b.name ? -1 : 1));
        }
    }

    useEffect(() => {
        getUsers();
        getPostTags();
    }, [])


    const handleGetPosts = async (params: TPagedParams<TPost>) => {
        if (!params) params = {};
        params.orderBy = 'createDate';
        params.order = 'DESC';
        const data = await client?.getFilteredPosts({
            customFragment: gql`
                fragment PostListFragment on Post {
                    id
                    slug
                    pageTitle
                    createDate
                    updateDate
                    title
                    author {
                        id
                        fullName
                        avatar
                    }
                    mainImage
                    publishDate
                    published
                    featured
                }
            `,
            customFragmentName: 'PostListFragment',
            pagedParams: params,
            filterParams: filterInput.current,
        });
        if (data?.pagedMeta?.totalElements) {
            totalElements.current = data.pagedMeta?.totalElements;
        }
        return data;
    }

    const resetList = () => {
        const list = getBlockInstance<TCList>(listId)?.getContentInstance();
        list.clearState();
        list.init();
    }

    const updateList = () => {
        const list = getBlockInstance<TCList>(listId)?.getContentInstance();
        list?.updateData();
    }

    const handleFilterInput = debounce(400, () => {
        filterInput.current.titleSearch = (document.getElementById(titleSearchId) as HTMLInputElement)?.value ?? undefined;
        resetList();
    });

    const handleAuthorSearch = (event, newValue: TUser | null) => {
        filterInput.current.authorId = newValue?.id;
        handleFilterInput();
    }

    const handleDeletePostBtnClick = (post: TPost) => {
        setPostToDelete(post);
    }

    const handleDeletePost = async () => {
        setIsLoading(true);
        if (postToDelete) {
            try {
                await client?.deletePost(postToDelete.id)
                toast.success('Post deleted');
            } catch (e) {
                console.error(e);
                toast.error('Failed to delete post');
            }
        }
        setIsLoading(false);
        setPostToDelete(null);
        updateList();
    }

    const handleCreatePost = () => {
        history.push(`${postPageInfo.baseRoute}/new`);
    }

    const handleChangeTags = (event, newValue: TTag[]) => {
        filterInput.current.tagIds = newValue.map(tag => tag.id);
        handleFilterInput();
    }

    const handleToggleItemSelection = (data: TPost) => {
        toggleItemSelection(data.id);
    }

    const handleToggleSelectAll = () => {
        toggleSelectAll()
    }

    const handleDeleteSelectedBtnClick = () => {
        if (countSelectedItems(totalElements.current) > 0)
            setDeleteSelectedOpen(true);
    }

    const handleDeleteSelected = async () => {
        setIsLoading(true);
        try {
            await client?.deleteManyFilteredPosts(getSelectedInput(), filterInput.current);
            toast.success('Posts deleted');
        } catch (e) {
            console.error(e);
            toast.error('Failed to delete posts');
        }
        setDeleteSelectedOpen(false);
        setIsLoading(false);
        updateList();
        resetSelected();
    }

    const handleChangePublished = (event: any) => {
        switch (event.target.value) {
            case 'all':
                filterInput.current.published = undefined;
                break;
            case 'published':
                filterInput.current.published = true;
                break;
            case 'draft':
                filterInput.current.published = false;
                break;
        }
        resetList();
    }

    return (
        <div className={styles.PostList}>
            <div className={styles.listHeader}>
                <div className={styles.filter}>
                    <div className={commonStyles.center}>
                        <Tooltip title="Select all">
                            <Checkbox
                                style={{ marginRight: '10px' }}
                                checked={props.allSelected ?? false}
                                onChange={handleToggleSelectAll}
                            />
                        </Tooltip>
                    </div>
                    <TextField
                        className={styles.filterItem}
                        id={titleSearchId}
                        placeholder="Search by title"
                        variant="standard"
                        onChange={handleFilterInput}
                    />
                    <Autocomplete
                        size="small"
                        className={`${styles.filterItem} ${styles.authorSearch}`}
                        disabled={!users || users.length === 0}
                        options={users ?? []}
                        getOptionLabel={(option) => option.fullName}
                        style={{ width: 200 }}
                        onChange={handleAuthorSearch}
                        renderInput={(params) =>
                            <TextField {...params}
                                placeholder="Author"
                                variant="standard"
                                // variant="outlined"
                                size="medium"
                            />}
                    />
                    <Autocomplete
                        multiple
                        className={styles.filterItem}
                        options={tags ?? []}
                        defaultValue={tags ?? []}
                        getOptionLabel={(option) => option.name}
                        style={{ width: 200 }}
                        onChange={handleChangeTags}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="standard"
                                placeholder="Tags"
                            />
                        )}
                    />
                    <Select
                        className={styles.filterItem}
                        defaultValue="all"
                        variant="standard"
                        onChange={handleChangePublished}
                    >
                        <MenuItem value={'all'}>All</MenuItem>
                        <MenuItem value={'published'}>Published</MenuItem>
                        <MenuItem value={'draft'}>Draft</MenuItem>
                    </Select>
                </div>
                <div className={styles.pageActions} >
                    <Tooltip title="Delete selected">
                        <IconButton
                            onClick={handleDeleteSelectedBtnClick}
                            aria-label="Delete selected"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Create new post">
                        <IconButton
                            onClick={handleCreatePost}
                            aria-label="add"
                        >
                            <AddCircleIcon />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
            <CList<TPost, ListItemProps>
                className={styles.listWrapper}
                id={listId}
                ListItem={PostListItem}
                useAutoLoading
                usePagination
                useQueryPagination
                listItemProps={{ handleDeletePostBtnClick, toggleSelection: handleToggleItemSelection }}
                loader={handleGetPosts}
                cssClasses={{
                    scrollBox: styles.list,
                    contentWrapper: styles.listContent

                }}
                elements={{
                    pagination: Pagination,
                    preloader: listPreloader
                }}
            />
            <ConfirmationModal
                open={Boolean(postToDelete)}
                onClose={() => setPostToDelete(null)}
                onConfirm={handleDeletePost}
                title="Delete post?"
            />
            <ConfirmationModal
                open={deleteSelectedOpen}
                onClose={() => setDeleteSelectedOpen(false)}
                onConfirm={handleDeleteSelected}
                title={`Delete ${countSelectedItems(totalElements.current)} item(s)?`}
                disabled={isLoading}
            />
            <LoadingStatus isActive={isLoading} />
        </div>
    )
}

export default connect(mapStateToProps)(PostList);
