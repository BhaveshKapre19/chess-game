import { memo, useEffect, useMemo, useRef } from 'react';

export const MoveHistory = memo(function MoveHistory({ history, pgn }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const movePairs = useMemo(() => {
    const pairs = [];
    for (let i = 0; i < history.length; i += 2) {
      pairs.push({ white: history[i], black: history[i + 1] || null, index: Math.floor(i / 2) + 1 });
    }
    return pairs;
  }, [history]);

  const lastPairIndex = movePairs.length - 1;

  return (
    <>
      <div className="move-history-list" ref={scrollRef}>
        {movePairs.length === 0 ? (
          <p className="no-moves-msg">No moves yet. You play White.</p>
        ) : (
          movePairs.map((pair, idx) => (
            <div
              key={pair.index}
              className={`move-row${idx === lastPairIndex ? ' active-move' : ''}`}
            >
              <span className="move-num">{pair.index}.</span>
              <span className="move-san">{pair.white.san}</span>
              <span className={`move-san${!pair.black ? ' pending' : ''}`}>
                {pair.black ? pair.black.san : '...'}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="pgn-section">
        <span className="pgn-label">PGN</span>
        <p className="pgn-text">{pgn || 'Game PGN will appear here.'}</p>
      </div>
    </>
  );
});
