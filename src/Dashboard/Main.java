package Dashboard;

import java.io.IOException;

import javax.swing.JFrame;
import Dashboard.VideoStreamPlayer;
import Dashboard.MapPanel;

public class Main {

    private JFrame frame = new JFrame();
    
    public Main() {
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setVisible(true);
        
        //Add map panel
        MapPanel map = new MapPanel();
        frame.add(map.getPanel());
        frame.pack();
        //map.addPoint("red", 29.564835, -95.081320);

        /*VideoStreamPlayer vsp = new VideoStreamPlayer();
        String[] arg = {"C:\\Users\\djruh_000\\Desktop\\Computer_Science\\robo-ops\\stock.mp4"};
        try {
            vsp.init(arg);
        }
        catch (InterruptedException e) { e.printStackTrace();}
        catch (IOException e) { e.printStackTrace(); }*/
    }
    
    
    public static void main(String[]  args) {
        Main m = new Main();
    }

}
