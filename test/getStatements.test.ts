import fs from 'fs';
// import { Grammars } from '../src';
import * as statementsApi from '../src/tree/getStatements';
import * as utilApi from '../src/util';


// Test getStatements function
describe('getStatements', () => {

  // Mock nodeTypes
  // const masterGrammars: Grammars = {
  //   name: 'typescript',
  //   nodeTypeInfo: [
  //     {
  //       type: 'import_declaration',
  //       named: true
  //     },
  //     {
  //       type: 'function_declaration',
  //       named: true
  //     },
  //     {
  //       type: 'variable_declaration',
  //       named: true
  //     },
  //     {
  //       type: 'return_statement',
  //       named: true
  //     },
  //     {
  //       type: 'jsx_element',
  //       named: true
  //     },
  //   ]
  // }
  
  
  
  
  // [
  //   'import_declaration',
  //   'function_declaration',
  //   'variable_declaration',
  //   'return_statement',
  //   'jsx_element',
  // ];
  
  // Mock code
  const code = `
  import React from 'react';
  import dayjs from 'dayjs';
  
  import { useGrid, sh } from 'awayto/hooks';
  import { useParams } from 'react-router';
  
  export function ManageFeedbacks(): JSX.Element {
  
    const { groupName } = useParams();
    if (!groupName) return <></>;
    
    const { data: feedbacks } = sh.useGetGaaaaaaaaaaaaaaaaaaaroupFeedbackQuery({ groupName });

    const newFunction = (some: string) => {
      
      const someinternalProp = Math.floor(20.3);

      function superInternalFunction() {
        const myThing = useCallback(() => {
          return [];
        }, [true]);
      }

      return 'yo' + someinternalProp.toString();
    }

  
    const FeedbackGrid = useGrid({
      rows: feedbacks || [],
      columns: [
        { flex: 1, headerName: 'User', field: 'username' },
        { flex: 1, headerName: 'Message', field: 'message' },
        { flex: 1, headerName: 'Created', field: 'createdOn', renderCell: ({ row }) => dayjs(row.createdOn).format("YYYY-MM-DD hh:mm a") }
      ]
    });
  
    return <FeedbackGrid />
  }
  
  export default ManageFeedbacks;
  `;

  const pythoncode = `
  #!/usr/bin/python3
  import sys, string
  iddict = { }
  for line in sys.stdin.readlines():
      line = str.lstrip(line)
      if line == '' or line[0] == '#':
          continue
      parts = str.split(line, ':')
      userid = str.strip(parts[0])
      name = str.strip(parts[4])
      compos = str.find(name, ',')
      if compos != -1:
          name = name[0:compos]
      if name == '' or name == userid:
          name = '[ none ]'
      iddict[userid] = name
  ids = sorted(iddict.keys())
  for userid in ids:
      human = iddict[userid]
      if len(userid) < 12:
          userid = userid + ' ' * (12 - len(userid))
      print(userid + human)
`;

  console.log({ code, pythoncode })

  it('should return a list of statements given a supported file', async () => {
    // jest.spyOn(statementsApi, 'getMasterGrammars').mockResolvedValue(masterGrammars)
    jest.spyOn(utilApi, 'getFileFromDir').mockReturnValue(pythoncode);

    const statements = await statementsApi.getStatements('myfile.tsx');
    fs.writeFileSync('statements.json', JSON.stringify(statements), { encoding: 'utf-8' });
    console.log({ statements });
  });

});