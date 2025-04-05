import React from 'react';
import { render, screen } from '@testing-library/react'
import Post from '../../src/Post'
describe('Post', () => {
    const post = {
        username: "PEACEFUL",
        date: "25 March 2025",
        key: 5,
        text: "I love testing",
        initialLiked: true,
        idx: 5,
    }
    it('should render whole post', () => {
        render(<Post username={post.username}
            date={post.date}
            text={post.text}
            initialLiked={post.initialLiked}
            idx={post.idx}/>)
        const user = screen.getByRole("heading");
        expect(user).toHaveTextContent(/peaceful 25 March 2025/i)
    })
    it('should render the post text', () => {
        render(
          <Post
            username={post.username}
            date={post.date}
            text={post.text}
            initialLiked={post.initialLiked}
            idx={post.idx}
          />
        );
        const textElement = screen.getByText(/I love testing/i);
        expect(textElement).toBeInTheDocument();
    });
    it('should render the empty heart icon if initialLiked is false', () => {
        render(
          <Post
            username={post.username}
            date={post.date}
            text={post.text}
            initialLiked={false}
            idx={post.idx}
          />
        );
        const likedIcon = screen.getByTestId('io-ios-heart-empty'); // Add data-testid to IoIosHeart
        expect(likedIcon).toBeInTheDocument();
        expect(screen.queryByTestId('io-ios-heart')).toBeNull();
      });
    it('should render the filled heart icon if initialLiked is true', () => {
        render(
          <Post
            username={post.username}
            date={post.date}
            text={post.text}
            initialLiked={true}
            idx={post.idx}
          />
        );
        const likedIcon = screen.getByTestId('io-ios-heart'); // Add data-testid to IoIosHeart
        expect(likedIcon).toBeInTheDocument();
        expect(screen.queryByTestId('io-ios-heart-empty')).toBeNull();
      });
      it('should render the user profile icon', () => {
        render(
          <Post
            username={post.username}
            date={post.date}
            text={post.text}
            initialLiked={post.initialLiked}
            idx={post.idx}
          />
        );
        const profileIcon = screen.getByTestId('fa-user-circle'); 
        expect(profileIcon).toBeInTheDocument();
      });
})