import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { parseCSV } from '../../utils/csvParser';
import { performJoin } from '../../utils/mappingUtils';
import * as S from './CSVInspector.styles';
import CSVTabPanel from './CSVTabPanel';

/**
 * CSV Inspector – manages two CSV uploads with tabs,
 * a join configurator, and a third "Joined" tab for the result.
 */
const CSVInspector = ({ onCSVUpload }) => {
  const [csvDataA, setCsvDataA] = useState(null);
  const [csvDataB, setCsvDataB] = useState(null);
  const [activeTab, setActiveTab] = useState('A');
  const [searchTermA, setSearchTermA] = useState('');
  const [searchTermB, setSearchTermB] = useState('');
  const [searchTermJoined, setSearchTermJoined] = useState('');

  // Join configuration state – keys is an array of { keyA, keyB } pairs
  const [joinConfig, setJoinConfig] = useState({
    type: 'inner',
    keys: [{ keyA: '', keyB: '' }],
  });
  const [joinExpanded, setJoinExpanded] = useState(false);
  const [joinApplied, setJoinApplied] = useState(false);

  const onCSVUploadRef = useRef(onCSVUpload);
  onCSVUploadRef.current = onCSVUpload;

  // Compute joined data when join is applied
  const joinedData = useMemo(() => {
    if (!joinApplied || !csvDataA || !csvDataB) return null;
    const hasKeys = joinConfig.keys.every((k) => k.keyA && k.keyB);
    if (!hasKeys) return null;
    return performJoin({ csvA: csvDataA, csvB: csvDataB }, joinConfig);
  }, [joinApplied, csvDataA, csvDataB, joinConfig]);

  // Notify parent whenever CSV data changes
  useEffect(() => {
    onCSVUploadRef.current({
      csvA: csvDataA,
      csvB: csvDataB,
      csvJoined: joinedData,
      joinConfig: joinApplied ? joinConfig : null,
    });
  }, [csvDataA, csvDataB, joinedData, joinApplied, joinConfig]);

  // Reset join when either CSV is cleared
  useEffect(() => {
    if (!csvDataA || !csvDataB) {
      setJoinApplied(false);
      setJoinExpanded(false);
      setJoinConfig({ type: 'inner', keys: [{ keyA: '', keyB: '' }] });
    }
  }, [csvDataA, csvDataB]);

  // Generic file handler
  const handleFileDrop = useCallback((acceptedFiles, setCsvData, tabId) => {
    if (acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const parsed = parseCSV(event.target.result);
      if (parsed.error) {
        alert(`Error parsing CSV: ${parsed.error}`);
        return;
      }
      setCsvData({ fileName: file.name, ...parsed });
      setActiveTab(tabId);
    };
    reader.onerror = () => alert('Error reading file. Please try again.');
    reader.readAsText(file);
  }, []);

  const onDropA = useCallback(
    (files) => handleFileDrop(files, setCsvDataA, 'A'),
    [handleFileDrop]
  );
  const onDropB = useCallback(
    (files) => handleFileDrop(files, setCsvDataB, 'B'),
    [handleFileDrop]
  );

  const handleClearA = useCallback(() => {
    setCsvDataA(null);
    setSearchTermA('');
  }, []);
  const handleClearB = useCallback(() => {
    setCsvDataB(null);
    setSearchTermB('');
  }, []);

  /* ── Join Handlers ── */

  const hasBothCSVs = Boolean(csvDataA && csvDataB);

  const handleApplyJoin = () => {
    const incomplete = joinConfig.keys.some((k) => !k.keyA || !k.keyB);
    if (incomplete) {
      alert('Please select join keys for every key pair.');
      return;
    }
    setJoinApplied(true);
    setJoinExpanded(false); // collapse config
    setActiveTab('Joined'); // switch to joined tab
  };

  const handleRemoveJoin = () => {
    setJoinApplied(false);
    setJoinConfig({ type: 'inner', keys: [{ keyA: '', keyB: '' }] });
    setActiveTab('A');
  };

  const handleAddKeyPair = () => {
    setJoinConfig((c) => ({
      ...c,
      keys: [...c.keys, { keyA: '', keyB: '' }],
    }));
  };

  const handleRemoveKeyPair = (index) => {
    setJoinConfig((c) => ({
      ...c,
      keys: c.keys.filter((_, i) => i !== index),
    }));
  };

  const handleKeyChange = (index, field, value) => {
    setJoinConfig((c) => ({
      ...c,
      keys: c.keys.map((k, i) => (i === index ? { ...k, [field]: value } : k)),
    }));
  };

  const handleEditJoin = () => {
    setJoinExpanded(true);
  };

  const columnsA = csvDataA?.columns || [];
  const columnsB = csvDataB?.columns || [];

  return (
    <S.Container>
      <S.Title>CSV Inspector</S.Title>

      {/* ── Tabs ── */}
      <S.TabsContainer>
        <S.Tab active={activeTab === 'A'} onClick={() => setActiveTab('A')}>
          <S.CSVBadge csvId="A">A</S.CSVBadge>
          {csvDataA ? 'CSV A' : 'Upload CSV A'}
        </S.Tab>
        <S.Tab active={activeTab === 'B'} onClick={() => setActiveTab('B')}>
          <S.CSVBadge csvId="B">B</S.CSVBadge>
          {csvDataB ? 'CSV B' : 'Upload CSV B'}
        </S.Tab>
        {joinApplied && joinedData && (
          <S.Tab active={activeTab === 'Joined'} onClick={() => setActiveTab('Joined')}>
            <S.CSVBadge csvId="Joined">⚡</S.CSVBadge>
            Joined
          </S.Tab>
        )}
      </S.TabsContainer>

      {/* ── Join Button / Config ── */}
      {hasBothCSVs && (
        <S.JoinSection>
          {!joinExpanded && !joinApplied && (
            <S.JoinButton onClick={() => setJoinExpanded(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 8L21 12M21 12L17 16M21 12H9M7 16L3 12M3 12L7 8M3 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Join CSV A &amp; CSV B
            </S.JoinButton>
          )}

          {!joinExpanded && joinApplied && (
            <S.JoinAppliedBar>
              <S.JoinAppliedInfo>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>
                  {joinConfig.type.toUpperCase()} on{' '}
                  {joinConfig.keys.map((k, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && ' & '}
                      <strong>{k.keyA}</strong>=<strong>{k.keyB}</strong>
                    </React.Fragment>
                  ))}
                  {joinedData && ` · ${joinedData.rowCount} rows`}
                </span>
              </S.JoinAppliedInfo>
              <S.JoinAppliedActions>
                <S.JoinSmallButton onClick={handleEditJoin} title="Edit join settings">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </S.JoinSmallButton>
                <S.JoinSmallButton onClick={handleRemoveJoin} title="Remove join" variant="danger">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </S.JoinSmallButton>
              </S.JoinAppliedActions>
            </S.JoinAppliedBar>
          )}

          {joinExpanded && (
            <S.JoinConfigPanel>
              <S.JoinConfigTitle>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 8L21 12M21 12L17 16M21 12H9M7 16L3 12M3 12L7 8M3 12H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Join Configuration
              </S.JoinConfigTitle>

              <S.JoinConfigRow>
                <S.JoinConfigGroup>
                  <S.JoinLabel>Join Type</S.JoinLabel>
                  <S.JoinSelect
                    value={joinConfig.type}
                    onChange={(e) => setJoinConfig((c) => ({ ...c, type: e.target.value }))}
                  >
                    <option value="inner">INNER JOIN</option>
                    <option value="left">LEFT JOIN</option>
                    <option value="right">RIGHT JOIN</option>
                    <option value="full">FULL OUTER JOIN</option>
                  </S.JoinSelect>
                  <S.JoinHelpText>
                    {joinConfig.type === 'inner' && 'Returns rows with matching keys in both CSVs'}
                    {joinConfig.type === 'left' && 'All rows from CSV A, matches from CSV B'}
                    {joinConfig.type === 'right' && 'All rows from CSV B, matches from CSV A'}
                    {joinConfig.type === 'full' && 'All rows from both, nulls where no match'}
                  </S.JoinHelpText>
                </S.JoinConfigGroup>
              </S.JoinConfigRow>

              <S.JoinLabel style={{ marginBottom: -2 }}>Join Keys</S.JoinLabel>
              <S.JoinKeyPairsContainer>
                {joinConfig.keys.map((pair, idx) => (
                  <S.JoinKeyPairRow key={idx}>
                    <S.JoinKeyPairSelects>
                      <S.JoinKeyPairSelectWrap>
                        <S.JoinSelect
                          value={pair.keyA}
                          onChange={(e) => handleKeyChange(idx, 'keyA', e.target.value)}
                          title="Key from CSV A"
                        >
                          <option value="">A: select…</option>
                          {columnsA.map((col) => (
                            <option key={col.name} value={col.name}>
                              {col.name}
                            </option>
                          ))}
                        </S.JoinSelect>
                      </S.JoinKeyPairSelectWrap>
                      <S.JoinKeyEqualsInline>=</S.JoinKeyEqualsInline>
                      <S.JoinKeyPairSelectWrap>
                        <S.JoinSelect
                          value={pair.keyB}
                          onChange={(e) => handleKeyChange(idx, 'keyB', e.target.value)}
                          title="Key from CSV B"
                        >
                          <option value="">B: select…</option>
                          {columnsB.map((col) => (
                            <option key={col.name} value={col.name}>
                              {col.name}
                            </option>
                          ))}
                        </S.JoinSelect>
                      </S.JoinKeyPairSelectWrap>
                    </S.JoinKeyPairSelects>
                    {joinConfig.keys.length > 1 && (
                      <S.JoinKeyPairRemoveBtn onClick={() => handleRemoveKeyPair(idx)} title="Remove this key pair">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </S.JoinKeyPairRemoveBtn>
                    )}
                  </S.JoinKeyPairRow>
                ))}
              </S.JoinKeyPairsContainer>
              <S.JoinAddKeyButton onClick={handleAddKeyPair}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Add key pair
              </S.JoinAddKeyButton>

              <S.JoinConfigActions>
                <S.JoinApplyButton onClick={handleApplyJoin}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12L10 17L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Apply Join
                </S.JoinApplyButton>
                <S.JoinCancelButton onClick={() => {
                  setJoinExpanded(false);
                  if (!joinApplied) {
                    setJoinConfig({ type: 'inner', keys: [{ keyA: '', keyB: '' }] });
                  }
                }}>
                  Cancel
                </S.JoinCancelButton>
              </S.JoinConfigActions>
            </S.JoinConfigPanel>
          )}
        </S.JoinSection>
      )}

      {/* ── Tab Content ── */}
      <S.TabContent active={activeTab === 'A'}>
        <CSVTabPanel
          csvId="A"
          csvData={csvDataA}
          searchTerm={searchTermA}
          onSearchChange={setSearchTermA}
          onDrop={onDropA}
          onClear={handleClearA}
        />
      </S.TabContent>

      <S.TabContent active={activeTab === 'B'}>
        <CSVTabPanel
          csvId="B"
          csvData={csvDataB}
          searchTerm={searchTermB}
          onSearchChange={setSearchTermB}
          onDrop={onDropB}
          onClear={handleClearB}
        />
      </S.TabContent>

      {joinApplied && joinedData && (
        <S.TabContent active={activeTab === 'Joined'}>
          <CSVTabPanel
            csvId="Joined"
            csvData={joinedData}
            searchTerm={searchTermJoined}
            onSearchChange={setSearchTermJoined}
            onDrop={() => {}} // no upload for joined
            onClear={handleRemoveJoin}
            isReadOnly
          />
        </S.TabContent>
      )}
    </S.Container>
  );
};

export default CSVInspector;
