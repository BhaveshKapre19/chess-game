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
      pairs.push({
        white: history[i],
        black: history[i + 1] ? history[i + 1] : null,
        index: Math.floor(i / 2) + 1,
      });
    }

    return pairs;
  }, [history]);

  return (
    <div className="move-history-container">
      <div className="move-history-title">
        <div>
          <span className="section-kicker">Notation</span>
          <h3>Move History</h3>
        </div>
      </div>
      <div className="move-history-list" ref={scrollRef}>
        {movePairs.length === 0 ? (
          <p className="no-moves">No moves yet.</p>
        ) : (
          <table className="move-history-table">
            <tbody>
              {movePairs.map((pair) => (
                <tr key={pair.index} className="move-row">
                  <td className="move-number">{pair.index}.</td>
                  <td className="move-white">{pair.white.san}</td>
                  <td className="move-black">{pair.black ? pair.black.san : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="pgn-panel">
        <span className="pgn-label">PGN</span>
        <p>{pgn || 'Game PGN will appear here.'}</p>
      </div>
    </div>
  );
});
