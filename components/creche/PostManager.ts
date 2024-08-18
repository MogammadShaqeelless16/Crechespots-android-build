// PostManager.tsx
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Post } from './constants';

const usePosts = (searchQuery: string) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  useEffect(() => {
    filterPosts(searchQuery);
  }, [searchQuery, posts]);

  const fetchPosts = (pageNumber: number) => {
    setLoading(true);
    axios
      .get(`https://shaqeel.wordifysites.com/wp-json/wp/v2/creche?_page=${pageNumber}&_per_page=10`)
      .then((response) => {
        const newPosts: Post[] = response.data.map((post: any) => ({
          id: post.id,
          title: post.title,
          registered: post.registered,
          address: post.address,
          price: post.price,
          header_image: post.header_image,
          logo_image: post.logo_image,
          facebook: post.facebook,
          whatsapp: post.whatsapp,
          instagram: post.instagram,
          content: post.content,
          description: post.description,
          latitude: post.latitude,
          longitude: post.longitude,
          full_day_care: post.full_day_care,
          half_day_care: post.half_day_care,
          meals_and_snacks: post.meals_and_snacks,
          after_school_care: post.after_school_care,
          drop_in_care: post.drop_in_care,
          special_programs: post.special_programs,
          emergency_occasional_care: post.emergency_occasional_care,
        }));
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        setFilteredPosts((prevPosts) => [...prevPosts, ...newPosts]);
        setHasMore(response.data.length > 0);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
        setRefreshing(false);
      });
  };

  const filterPosts = (query: string) => {
    const lowerCaseQuery = query.toLowerCase();

    const updatedPosts = posts.filter((post) => {
      const title = post.title.rendered.toLowerCase();
      const address = post.address ? post.address.toLowerCase() : '';
      const price = post.price ? post.price.toString() : '';

      return (
        title.includes(lowerCaseQuery) ||
        address.includes(lowerCaseQuery) ||
        price.includes(lowerCaseQuery)
      );
    });

    setFilteredPosts(updatedPosts);
  };

  const loadMorePosts = () => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1); // Reset page to 1 to reload the first page of posts
    setPosts([]); // Clear existing posts to fetch fresh data
    fetchPosts(1); // Fetch posts from the first page
  }, []);

  return {
    posts,
    filteredPosts,
    loading,
    error,
    refreshing,
    loadMorePosts,
    handleSearch: (text: string) => filterPosts(text),
    onRefresh,
  };
};

export default usePosts;
